/* eslint-disable class-methods-use-this */
import Vue from 'vue';
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';

/**
 * Lodash functions
 * @see https://lodash.com/docs
 */
import _invert from 'lodash/invert';
import _pick from 'lodash/pick';
import _forEach from 'lodash/forEach';
import _isArray from 'lodash/isArray';
import _isPlainObject from 'lodash/isPlainObject';
import _isObject from 'lodash/isObject';
import _isFunction from 'lodash/isFunction';
import _isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';
import _uniqueId from 'lodash/uniqueId';
import _once from 'lodash/once';
import _flow from 'lodash/flow';
import _trim from 'lodash/trim';
import _has from 'lodash/has';
import _get from 'lodash/get';
import _set from 'lodash/set';
import _unset from 'lodash/unset';
import _defaultsDeep from 'lodash/defaultsDeep';
import _defaultTo from 'lodash/defaultTo';
import _map from 'lodash/map';
import _mapValues from 'lodash/mapValues';
import _isEqual from 'lodash/isEqual';
import _castArray from 'lodash/castArray';
import _keys from 'lodash/keys';

/**
 * Reserved keywords that can't be used for property or option names.
 */
const RESERVED = _invert([
  '$_uid',
  '$_listeners',
  '$_options',
  '$_properties',
  '$_originals',
  '$_marks',
  '$_mutations',
  '$_http',
]);

/**
 * Recursive deep copy helper that honours the "clone" function of models and
 * collections. This is required to support nested instances.
 *
 * @param {Object} source
 * @param {Object} target
 * @param {Array}  keys     Optional
 */
const copyFrom = (source, target, keys = null) => {
  const src = (keys) ? _pick(source, keys) : source;

  _forEach(src, (value, key) => {
    if (_isArray(value)) {
      Vue.set(target, key, []);
      copyFrom(value, target[key]);
    } else if (_isPlainObject(value)) {
      Vue.set(target, key, {});
      copyFrom(value, target[key]);
    } else if (_isObject(value) && _isFunction(value.clone)) {
      Vue.set(target, key, value.clone());
    } else {
      Vue.set(target, key, _cloneDeep(value));
    }
  });
};

/**
 * Base model class with all cool reactive stuff, but without request functionality.
 *
 * @property {string} $_uid
 * @property {Object} $_listeners
 * @property {Object} $_options
 * @property {Object} $_originals
 * @property {Object} $_properties
 * @property {Object} $_marks
 */
export default class Base {
  constructor(properties = {}, marks = {}, options = {}) {
    // Define an automatic unique ID. This is primarily to distinguish
    // between multiple instances of the same name and data.
    Object.defineProperty(this, '$_uid', {
      value: _uniqueId(),
      enumerable: false,
      configurable: false,
      writable: false,
    });

    Vue.set(this, '$_listeners', {}); // Event listeners
    Vue.set(this, '$_options', {}); // Internal option store
    Vue.set(this, '$_originals', {}); // Original(saved) property state.
    Vue.set(this, '$_properties', {}); // Active property state.
    Vue.set(this, '$_marks', {}); // Marks that contain this model.

    this.$_mutators = {}; // Mutator cache

    this.setOptions(options);

    // Cache certain methods that don't need to be evaluated more than once.
    this.memoize();

    // Cache mutators pipelines so that they can run as a single function.
    this.compileMutators();

    // Assign all given model data to the model's properties and originals.
    this.assign(properties);

    // Assign all given marks to the model's marks.
    this.assignMarks(marks);

    this.boot();
  }

  /**
   * Called after construction, this hook allows you to add some extra setup
   * logic without having to override the constructor.
   */
  boot() {

  }

  /**
   * @returns {string} The class name of this instance.
   */
  get $class() {
    return (Object.getPrototypeOf(this)).constructor.name;
  }

  /**
   * A convenience wrapper around the model's properties that are saved.
   * This is similar to the `saved` method, but instead of accessing a single
   * property it returns the whole saved object, so that you can do something
   * like model.$originals.property when you want to display it somewhere.
   *
   * @returns {Object} This model's saved, originals data.
   */
  get $() {
    return this.$_originals;
  }

  /**
   * @returns {Object} This model's "active" state properties.
   */
  get $properties() {
    return this.$_properties;
  }

  /**
   * @returns {Object} This model's marks.
   */
  get $marks() {
    return this.$_marks;
  }

  /**
   * Prepare certain methods to only be called once. These are methods that
   * are expected to return the same data every time.
   *
   * @see {@link https://lodash.com/docs/#once}
   */
  memoize() {
    const memoized = [
      // These do not need to be evaluated every time.
      'defaultEventContext',
      'mutations',
    ];

    _forEach(memoized, (name) => {
      this[name] = _once(this[name]);
    });

    return this;
  }

  /**
   * Returns the default context for all events emitted by this instance.
   *
   * @returns {Object}
   */
  defaultEventContext() {
    return { target: this };
  }

  /**
   * Emits an event by name to all registered listeners on that event.
   * Listeners will be called in the order that they were added. If a listener
   * returns `false`, no other listeners will be called.
   *
   * @param {string} event    The name of the event to emit.
   * @param {Object} context  The context of the event, passed to listeners.
   */
  emit(event, context = {}) {
    const listeners = _get(this.$_listeners, event);

    if (!listeners) {
      return true;
    }

    // Run through each listener. If any of them return false, stop the
    // iteration and mark that the event wasn't handled by all listeners.
    const promises = [];

    _forEach(listeners, (f) => {
      promises.push(Promise.resolve().then(() => f.call(this, { ...context, ...this.defaultEventContext() })));
    });

    return Promise.all(promises);
  }

  /**
   * Registers an event listener for a given event.
   *
   * Event names can be comma-separated to register multiple events.
   *
   * @param {string}   event      The name of the event to listen for.
   * @param {function} listener   The event listener, accepts context.
   */
  on(event, listener) {
    const events = _map(event.split(','), _trim);

    _forEach(events, (e) => {
      this.$_listeners[e] = this.$_listeners[e] || [];
      this.$_listeners[e].push(listener);
    });

    return this;
  }

  /**
   * @returns {Object} This class' default options.
   */
  static defaultOptions() {
    return {
      // Whether this model should mutate a property as it is changed,
      // before it is set. This is a rare requirement because you usually
      // don't  want to mutate something that you are busy editing.
      mutateOnChange: false,

      // Whether this model should mutate all properties before they are
      // synced to the "saved" state.
      mutateBeforeSync: true,
    };
  }

  /**
   * @returns {Object} This instance's default options.
   */
  static options() {
    return {};
  }

  /**
   * @param {Array|string} path Option path resolved by `_get`
   * @param {*} [def=undefined] Default value if the option is not set.
   *
   * @returns {*} The value of the given option path.
   */
  getOption(path, def) {
    return _get(this.$_options, path, def);
  }

  /**
   * Sets an option.
   *
   * @param {string} path
   * @param {*}      value
   */
  setOption(path, value) {
    _set(this.$_options, path, value);
    return this;
  }

  /**
   * Returns all the options that are currently set on this instance.
   *
   * @return {Object}
   */
  getOptions() {
    return _defaultTo(this.$_options, {});
  }

  /**
   * Sets all given options. Successive values for the same option won't be
   * overwritten, so this follows the 'defaults' behaviour, and not 'merge'.
   *
   * @param {...Object} options One or more objects of options.
   */
  setOptions(...options) {
    Vue.set(this, '$_options', _defaultsDeep(
      {},
      ...options, // Given options
      this.constructor.options(), // Instance defaults
      this.constructor.defaultOptions(), // Class defaults
    ));

    return this;
  }

  /**
   * Registers an property on this model so that it can be accessed directly
   * on the model, passing through `get` and `set`.
   */
  registerProperty(key) {
    // Protect against unwillingly using an property name that already
    // exists as an internal property or method name.
    if (_has(RESERVED, key)) {
      throw new Error(`Can't use reserved property name '${key}'`);
    }

    Vue.set(this, key);

    // Create dynamic accessors and mutations so that we can update the
    // model directly while also keeping the model properties in sync.
    Object.defineProperty(this, key, {
      configurable: true,
      get: () => this.get(key),
      set: (value) => this.set(key, value),
    });

    return this;
  }

  /**
   * @returns {Object} An empty representation of this model.
   *                   It's important that all model properties have a default
   *                   value in order to be reactive in Vue.
   */
  static defaults() {
    return {};
  }

  /**
   * Assigns all given model data to the model's properties and originals.
   * This will also fill any gaps using the model's default properties.
   *
   * @param {Object} properties
   *
   * @returns {Base} Returns itself.
   */
  assign(properties) {
    this.set({ ..._cloneDeep(this.constructor.defaults()), ...properties });
    this.sync();

    return this;
  }

  /**
   * Determines if the model has an property.
   *
   * @param  {string}  key
   * @returns {boolean} `true` if an property exists, `false` otherwise.
   *                   Will return true if the object exists but is undefined.
   */
  has(key) {
    return _has(this.$_properties, key);
  }

  /**
   * Similar to `getOriginal`, returns an property's value or a default value
   * if this model doesn't have the property.
   *
   * @param {string} key
   * @param {*} [def=undefined]
   *
   * @returns {*} The value of the property or `default` if not found.
   */
  get(key, def) {
    return _get(this.$_properties, key, def);
  }

  /**
   * Sets the value of an property and registers the magic "getter" in a way
   * that is compatible with Vue's reactivity. This method should always be
   * used when setting the value of an property.
   *
   * @param  {string|Object}  key
   * @param  {*} [value=undefined]
   *
   * @returns {*} The value that was set.
   */
  set(key, value) {
    const set = (k, v) => {
      const defined = this.has(k);
      // Only register the pass-through property if it's not already set up.
      // If it already exists on the instance, we know it has been.
      if (!defined) {
        this.registerProperty(k);
      }

      // Current value of the property, or `undefined` if not set
      const previous = this.get(k);

      // Run the property's mutations if required to do so on change.
      const val = (this.getOption('mutateOnChange')) ? this.cast(k, v) : v;

      Vue.set(this.$_properties, k, val);
      this.emit('set', { property: k, value: val });

      // Only consider a change if the property was already defined.
      const changed = defined && !_isEqual(previous, val);

      if (changed) {
        this.emit('change', { property: k, previous, current: val });
      }
    };

    if (_isPlainObject(key)) {
      _forEach(key, (v, k) => {
        set(k, v);
      });
    } else {
      set(key, value);
    }

    return this;
  }

  /**
   * Reverts all properties back to their defaults, or `undefined` if a
   * default value is not defined.
   *
   * You can also pass one or an array of keys to unset.
   *
   * @param {string|string[]} [keys=undefined]
   */
  unset(keys) {
    // We're cloning deep to avoid multiple referenceы to the same object,
    // otherwise updating the properties will also update the reference.
    const defaults = _cloneDeep(this.constructor.defaults());

    // Unset either specific properties or all properties if none provided.
    const properties = _defaultTo(keys, _keys(this.$_properties));

    // Unset either specific properties or all properties if none provided.
    _forEach(_castArray(properties), (attr) => {
      if (this.has(attr)) {
        Vue.set(this.$_properties, attr, _get(defaults, attr));
      }
    });

    return this;
  }

  /**
   * Delete properties and remove them from Vue's reactivity.
   *
   * You can also pass one or an array of keys to unset.
   *
   * @param {string|string[]|} [keys=undefined]
   */
  forget(keys) {
    // Delete either specific keys or all properties if keys none provided.
    _forEach(_defaultTo(keys, _keys(this.$_properties)), (key) => {
      _unset(this.$_properties, key);
      delete this[key];
    });
    return this;
  }

  /**
   * Reverts all properties back to their defaults, and completely removes all
   * properties that don't have defaults. This will also sync the originals
   * properties, and is not reversable.
   */
  clearProperties() {
    const defaults = this.constructor.defaults();

    Vue.set(this, '$_properties', _cloneDeep(defaults));
    Vue.set(this, '$_originals', _cloneDeep(defaults));

    return this;
  }

  /**
   * Similar to `get`, but accesses the originals(saved) properties instead.
   *
   * This is useful in cases where you want to display an property but also
   * change it. For example, a modal with a title based on a model field, but
   * you're also editing that field. The title will be updating reactively if
   * it's bound to the active property, so bind to the saved one instead.
   *
   * @param {string} key
   * @param {*} [def=undefined]
   *
   * @returns {*} The value of the property or `fallback` if not found.
   */
  getOriginal(key, def) {
    return _get(this.$_originals, key, def);
  }

  /**
   * @returns {Object}  This class' default marks.
   */
  static defaultMarks() {
    return {};
  }

  /**
   * @returns {Object} This class' default marks.
   */
  static marks() {
    return {};
  }

  /**
   * Assigns all given model marks to the model's marks.
   * This will also fill any gaps using the model's default marks.
   *
   * @param {Object} marks
   *
   * @returns {Base} Returns itself.
   */
  assignMarks(marks) {
    this.setMark({ ..._cloneDeep(this.constructor.defaultMarks()), ..._cloneDeep(this.constructor.marks()), ...marks });
    return this;
  }

  /**
   * Determines if the model has an mark.
   *
   * @param  {string}  key
   * @returns {boolean} `true` if an mark exists, `false` otherwise.
   *                   Will return true if the object exists but is undefined.
   */
  hasMark(key) {
    return _has(this.$_marks, key);
  }

  /**
   * Returns an mark's value or a default value
   * if this model doesn't have the mark.
   *
   * @param {string} key
   * @param {*} [def=undefined]
   *
   * @returns {*} The value of the mark or `default` if not found.
   */
  getMark(key, def) {
    return _get(this.$_marks, key, def);
  }

  /**
   * Sets the value of an mark in a way that is compatible with Vue's reactivity.
   * This method should always be used when setting the value of an mark.
   *
   * @param  {string|Object}  key
   * @param  {*} [value=undefined]
   *
   * @returns {Base} The model instance.
   */
  setMark(key, value) {
    // Allow batch set of multiple marks at once, ie. mark({...});
    if (_isPlainObject(key)) {
      _forEach(key, (v, k) => {
        this.setMark(k, v);
      });

      return this;
    }

    const defined = this.hasMark(key);

    // Current value of the mark, or `undefined` if not set
    const previous = this.getMark(key);

    Vue.set(this.$_marks, key, value);

    // Only consider a change if the mark was already defined.
    const changed = defined && !_isEqual(previous, value);

    if (changed) {
      this.emit('mark change', { mark: key, previous, current: value });
    }

    return this;
  }

  /**
   * Reverts all marks back to their defaults, or `undefined` if a
   * default value is not defined.
   *
   * You can also pass one or an array of keys to unset.
   *
   * @param {string|string[]} [keys=undefined]
   */
  unsetMark(keys) {
    // We're cloning deep to avoid multiple referenceы to the same object,
    // otherwise updating the properties will also update the reference.
    const defaults = _cloneDeep(this.constructor.marks());

    // Unset either specific marks or all marks if none provided.
    const marks = _defaultTo(keys, _keys(this.$_marks));

    // Unset either specific properties or all properties if none provided.
    _forEach(_castArray(marks), (mark) => {
      if (this.hasMark(mark)) {
        Vue.set(this.$_marks, mark, _get(defaults, mark));
      }
    });

    return this;
  }

  /**
   * Delete marks and remove them from Vue's reactivity.
   *
   * You can also pass one or an array of keys to unset.
   *
   * @param {string|string[]} [keys=undefined]
   */
  forgetMark(keys) {
    // Delete either specific keys or all marks if keys none provided.
    _forEach(_defaultTo(keys, _keys(this.$_marks)), (key) => {
      _unset(this.$_marks, key);
    });
    return this;
  }

  /**
   * Resets model state, ie. `loading`, etc back to their initial states.
   */
  clearMarks() {
    const marks = this.constructor.marks();

    Vue.set(this, '$_marks', _cloneDeep(marks));
    return this;
  }

  /**
   * @returns {Object} property mutations keyed by property name.
   */
  mutations() {
    return {};
  }

  /**
   * Compiles all mutations into pipelines that can be executed quickly.
   */
  compileMutators() {
    this.$_mutators = _mapValues(this.mutations(), (m) => _flow(m));
    return this;
  }

  /**
   * @returns {*} The value of an property after applying its mutations.
   */
  cast(key, value) {
    const mutator = _get(this.$_mutators, key);
    return (mutator) ? mutator(value) : value;
  }

  /**
   * Mutates either specific properties or all properties if none provided.
   * @param {string|string[]} [keys=undefined]
   */
  mutate(keys) {
    if (!keys) {
      _forEach(this.$_properties, (value, attr) => {
        Vue.set(this.$_properties, attr, this.cast(attr, value));
      });
    } else {
      // Only mutate specific properties.
      _forEach(keys, (attr) => {
        Vue.set(this.$_properties, attr, this.cast(attr, this.get(attr)));
      });
    }

    return this;
  }

  /**
   * Sync the current properties to the originals properties. This is usually
   * only called on save. We have to clone the values otherwise we
   * end up with originals to the same object in both property sets.
   *
   * You can also pass one or an array of properties to sync.
   *
   * @param {string|string[]} [keys=undefined]
   */
  sync(keys) {
    // Mutate all properties before we sync them, if required to do so.
    if (this.getOption('mutateBeforeSync')) {
      this.mutate(keys);
    }

    // We're cloning deep to avoid multiple originals to the same object,
    // otherwise updating the properties will also update the originals.
    // Set each saved property to its active equivalent.
    const active = _cloneDeep(this.$_properties);

    // Sync either specific properties or all properties if none provided.
    if (!keys) {
      Vue.set(this, '$_originals', active);
    } else {
      _forEach(_castArray(keys), (attr) => {
        Vue.set(this.$_originals, attr, _get(active, attr));
      });
    }

    this.emit('sync');

    return this;
  }

  /**
   * Resets all properties back to their original values (source of truth).
   * A good use case for this is when form fields are bound directly to the
   * model's properties. Changing values in the form fields will change the
   * properties on the model. On cancel, you can revert the model back to
   * its saved, original state using reset().
   *
   * You can also pass one or an array of properties to reset.
   *
   * @param {string|string[]} [keys=undefined]
   */
  reset(keys) {
    // Reset specific properties.
    if (keys) {
      copyFrom(this.$_originals, this.$_properties, _castArray(keys));
    } else {
      // Reset all properties if one or more specific ones were not given.
      copyFrom(this.$_originals, this.$_properties);
    }

    this.emit('reset');

    return this;
  }

  /**
   * Reverts all properties back to their defaults, and completely removes all
   * properties that don't have defaults. This will also sync the originals
   * properties, and is not reversable.
   */
  clear() {
    this.clearProperties();
    this.clearMarks();

    return this;
  }

  /**
   * Returns an array of attribute names that have changed, or `false` if no
   * changes have been made since the last time this model was synced.
   *
   * @param {string} [type=default] The type of diff to be applied allow 'added'|'updated'|'deleted'|detailed
   *
   * @returns {Object|boolean} An object of changed properties(name: value), or `false`
   *                         if no attributes have changed since the last sync.
   */
  changed(type) {
    let dirty = {};

    const convertToSimpleObject = (object, handler = {}) => {
      _forEach(object, (v, k) => {
        if (v instanceof Base) {
          handler[k] = {};
          convertToSimpleObject(v.$properties, handler[k]);
        } else if (_isArray(v)) {
          handler[k] = [];
          convertToSimpleObject(v, handler[k]);
        } else if (_isObject(v)) {
          handler[k] = {};
          convertToSimpleObject(v, handler[k]);
        } else {
          handler[k] = v;
        }
      });

      return handler;
    };

    const originals = convertToSimpleObject(this.$_originals);
    const properties = convertToSimpleObject(this.$_properties);

    switch (type) {
      case 'added':
        dirty = addedDiff(originals, properties);
        break;
      case 'updated':
        dirty = updatedDiff(originals, properties);
        break;
      case 'deleted':
        dirty = deletedDiff(originals, properties);
        break;
      case 'detailed':
        dirty = detailedDiff(originals, properties);
        break;
      default:
        dirty = diff(originals, properties);
        break;
    }

    return _isEmpty(dirty) ? false : dirty;
  }

  /**
   * Creates a copy of this model, with the same properties and options. The
   * clone will also belong to the same collections as the subject.
   *
   * @returns {Base}
   */
  clone() {
    const properties = {};
    const originals = {};
    const marks = {};

    // Clone all properties and their descriptors.
    copyFrom(this.$_properties, properties);
    copyFrom(this.$_originals, originals);
    copyFrom(this.$_marks, marks);

    // Create a copy.
    const clone = new (this.constructor)(originals, marks);

    // Make sure that the clone has the same existing properties.
    clone.set(properties);

    // Make sure that the clone has the same existing options.
    clone.setOptions(this.getOptions());

    return clone;
  }

  /**
   * @returns {string} Default string representation.
   */
  toString() {
    return `<${this.$class}#${this.$_uid}>`;
  }

  /**
   * @returns {Object} A native representation of this model that will determine
   *                   the contents of JSON.stringify(model).
   */
  toJSON() {
    return this.$_properties;
  }
}
