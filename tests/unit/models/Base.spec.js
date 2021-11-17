/* eslint-disable class-methods-use-this  */
// eslint-disable-next-line max-classes-per-file
import { expect, assert } from 'chai';
import Model from '@/models/Base';

describe('models/Base.js (Model)', () => {
  describe('constructor', () => {
    it('should support no params', () => {
      const model = new Model();
      expect(model.$).to.eql({});
    });

    it('should support initial properties', () => {
      const model = new Model({ a: 1 });
      expect(model.$).to.eql({ a: 1 });
    });

    it('should support undefined initial properties', () => {
      const model = new Model(undefined);
      expect(model.$).to.eql({});
    });

    it('should support null initial properties', () => {
      const model = new Model(null);
      expect(model.$).to.eql({});
    });

    it('should support marks as initial register', () => {
      const model = new Model({}, { a: 1 });
      expect(model.$marks).to.eql({ a: 1 });
    });

    it('should support undefined initial marks', () => {
      const model = new Model({});
      expect(model.$marks).to.eql({});
    });

    it('should support null initial marks', () => {
      const model = new Model({}, null);
      expect(model.$marks).to.eql({});
    });

    it('should allow arbitrary options', () => {
      const model = new Model(null, null, { a: 1 });
      expect(model.getOption('a')).to.equal(1);
    });

    it('should honour default options', () => {
      const model = new class extends Model {
        static options() {
          return { loading: 5 };
        }
      }();
      expect(model.loading).to.be.an('undefined');
      expect(model.getOption('loading')).to.equal(5);
    });

    it('should override default options', () => {
      const SomeModel = class extends Model {
        static options() {
          return { loading: 5 };
        }
      };

      const model = new SomeModel(null, null, { loading: 10 });
      expect(model.loading).to.be.an('undefined');
      expect(model.getOption('loading')).to.equal(10);
    });
  });

  describe('$_uid', () => {
    it('should automatically generate unique incrementing ids', () => {
      const base = parseInt((new Model()).$_uid, 10);

      expect((new Model()).$_uid).to.equal((base + 1).toString());
      expect((new Model()).$_uid).to.equal((base + 2).toString());
      expect((new Model()).$_uid).to.equal((base + 3).toString());
    });
  });

  describe('boot', () => {
    it('should automatically called after constructor', () => {
      const SomeModel = class extends Model {
        boot() {
          this.set('a', 1);
        }
      };

      expect((new SomeModel()).a).to.equal(1);
    });
  });

  describe('$class', () => {
    it('should return the class name', () => {
      expect((new Model()).$class).to.equal(Model.name);
    });
  });

  describe('$', () => {
    it('should return saved values', () => {
      const model = new Model({ a: 1 });
      model.a = 2;
      expect(model.$.a).to.equal(1);
    });
  });

  describe('$properties', () => {
    it('should return active values', () => {
      const model = new Model({ a: 1 });
      model.a = 2;
      expect(model.$properties.a).to.equal(2);
    });
  });

  describe('$marks', () => {
    it('should return mark values', () => {
      expect((new Model({}, { a: 1 })).$marks.a).to.equal(1);
    });
  });

  describe('setOptions', () => {
    it('should merge recursively', () => {
      const SomeModel = class extends Model {
        static defaultOptions() {
          return {
            some: {
              recursive: {
                option: 'some',
              },
            },
          };
        }
      };

      const model = new SomeModel({}, null, {
        some: {
          recursive: {
            option: 'not-some',
          },
        },
      });

      expect(model.getOption('some.recursive.option')).to.equal('not-some');
    });

    it('should should merge with instance options', () => {
      const model = new class extends Model {
        static options() {
          return {
            some: {
              recursive: {
                option: 'some',
              },
            },
          };
        }
      }({}, null, {
        some: {
          recursive: {
            option: 'not-some',
          },
        },
      });

      expect(model.getOption('some.recursive.option')).to.equal('not-some');
    });
  });

  describe('on', () => {
    it('should register event listener', () => {
      const model = new Model();
      const f = () => {
      };
      model.on('test', f);

      expect(model.$_listeners).to.eql({ test: [f] });
    });
  });

  describe('emit', () => {
    it('should emit event to all listeners', async () => {
      const model = new Model();

      let count = 0;

      const calls = {
        a: false,
        b: false,
        c: false,
      };

      model.on('test', () => {
        calls.a = true;
        count += 1;
      });
      model.on('test', () => {
        calls.b = true;
        count += 1;
      });
      model.on('test', () => {
        calls.c = true;
        count += 1;
      });

      await model.emit('test');

      expect(count).to.equal(3);

      expect(calls.a).to.equal(true);
      expect(calls.b).to.equal(true);
      expect(calls.c).to.equal(true);
    });

    it('should not mind if we emit when no listeners exist', () => {
      const model = new Model();
      model.emit('test');
    });
  });

  describe('defaults', () => {
    it('should support default object', () => {
      const SomeModel = class extends Model {
        static defaults() {
          return { a: 1, b: 2 };
        }
      };
      const model = new SomeModel();
      expect(model.$).to.eql({ a: 1, b: 2 });
    });

    it('should support undefined', () => {
      const SomeModel = class extends Model {
        static defaults() {
        }
      };
      const model = new SomeModel();
      expect(model.$).to.eql({});
    });
  });

  describe('has', () => {
    it('should return true if a model has an property', () => {
      expect((new Model({ a: 1 })).has('a')).to.equal(true);
    });

    it('should return true if a model has an property that is undefined', () => {
      expect((new Model({ a: undefined })).has('a')).to.equal(true);
    });

    it('should return false if a model does not have an property', () => {
      expect((new Model({ a: 1 })).has('b')).to.equal(false);
    });
  });

  describe('get', () => {
    it('should return undefined if property not found', () => {
      expect((new Model()).get('attr')).to.be.an('undefined');
    });

    it('should return value of property if found', () => {
      expect((new Model({ a: 1 })).get('a')).to.equal(1);
    });

    it('should return default if property not found', () => {
      expect((new Model()).get('b', 5)).to.equal(5);
    });

    it('should not return default if property was found', () => {
      expect((new Model({ a: 1 })).get('a', 5)).to.equal(1);
    });
  });

  describe('set', () => {
    it('should set property if it does not already exist', () => {
      const model = new Model();
      model.set('a', 1);

      expect(model.a).to.equal(1);
      expect(model.$.a).to.be.an('undefined');
    });

    it('should overwrite property if it already exists', () => {
      const model = new Model({ a: 1 });
      model.set('a', 2);

      expect(model.a).to.equal(2);
      expect(model.$.a).to.equal(1);
    });

    it('should fail when trying to set reserved property name', () => {
      expect(() => (new Model()).set('$_properties', 1)).to.throw();
    });

    it('should not mutate values if `mutateOnChange` is false', () => {
      const SomeModel = class extends Model {
        mutations() {
          return {
            a: (v) => v.toString(),
          };
        }
      };

      const model = new SomeModel({ a: 1 }, null, { mutateOnChange: false });
      model.set('a', 5);

      expect(model.a).to.equal(5);
    });

    it('should mutate values if a mutator is set', () => {
      const SomeModel = class extends Model {
        mutations() {
          return {
            a: (v) => v.toString(),
          };
        }
      };
      const model = new SomeModel({ a: 1 }, null, { mutateOnChange: true });
      model.set('a', 5);

      expect(model.a).to.equal('5');
    });

    it('should mutate values if multiple mutations are set', () => {
      const SomeModel = class extends Model {
        mutations() {
          return {
            a: [(v) => (v * 2), (v) => v.toString()],
          };
        }
      };
      const model = new SomeModel({ a: 1 }, null, { mutateOnChange: true });
      model.set('a', 5);

      expect(model.a).to.equal('10');
    });

    it('should emit a change event when a value has changed', (done) => {
      const model = new Model({ a: 1 });

      model.on('change', (e) => {
        expect(e.target).to.equal(model);
        expect(e.property).to.equal('a');
        expect(e.previous).to.equal(1);
        expect(e.current).to.equal(5);
        expect(model.a).to.equal(5);
        done();
      });

      model.set('a', 5);
    });

    it('should not emit a change event when a value is set for the first time', () => {
      const model = new Model();

      model.on('change', () => {
        assert.fail('Should not have called the change event');
      });

      model.set('a', 1);
    });

    it('should emit a change event with the mutated value', (done) => {
      const SomeModel = class extends Model {
        mutations() {
          return {
            a: (v) => (v * 2),
          };
        }
      };

      const model = new SomeModel({ a: 1 }, null, { mutateOnChange: true, mutateBeforeSync: false });

      model.on('change', (e) => {
        expect(e.target).to.equal(model);
        expect(e.previous).to.equal(2);
        expect(e.current).to.equal(10);
        expect(model.a).to.equal(10);
        done();
      });

      model.set('a', 5);
    });

    it('should not emit a change event when a value has not changed', () => {
      const SomeModel = class extends Model {
        mutations() {
          return {
            a: (v) => v.toString(),
          };
        }
      };

      const model = new SomeModel({ a: 1 }, null, { mutateBeforeSync: false });

      model.on('change', () => {
        assert.fail('Should not have called the "change" event');
      });

      model.set('a', 1);
    });
  });

  describe('unset', () => {
    it('should revert a value to its default value', () => {
      const SomeModel = class extends Model {
        static defaults() {
          return { a: 1 };
        }
      };

      const model = new SomeModel({ a: 5 });

      expect(model.a).to.equal(5);

      model.unset('a');

      expect(model.a).to.equal(1);
    });

    it('should not fail if the property does not exist', () => {
      expect(() => (new Model()).unset('a')).not.to.throw();
    });

    it('should revert a value to undefined if it does not have a default', () => {
      const model = new Model({ a: 1 });

      expect(model.a).to.equal(1);

      model.unset('a');

      expect(model.a).to.be.an('undefined');
    });

    it('should support unsetting a specific property', () => {
      const model = new Model({ a: 1, b: 2 });

      model.unset('a');

      expect(model.a).to.be.an('undefined');
      expect(model.b).to.equal(2);
    });

    it('should support unsetting an array of properties', () => {
      const model = new Model({ a: 1, b: 2, c: 3 });

      model.unset(['b', 'c']);

      expect(model.a).to.equal(1);
      expect(model.b).to.be.an('undefined');
      expect(model.c).to.be.an('undefined');
    });

    it('should revert all values to their default values', () => {
      const SomeModel = class extends Model {
        static defaults() {
          return { a: 1, b: 2, c: 3 };
        }
      };

      const model = new SomeModel();

      model.a = 10;
      model.b = 20;
      model.c = 30;

      model.unset();

      expect(model.a).to.equal(1);
      expect(model.b).to.equal(2);
      expect(model.c).to.equal(3);
    });
  });

  describe('forget', () => {
    it('should delete property', () => {
      const model = new Model({ a: 5 });

      expect(model.has('a')).to.equal(true);

      model.forget('a');

      expect(model.has('a')).to.equal(false);
    });

    it('should not fail if the property does not exist', () => {
      expect(() => (new Model()).forget('a')).not.to.throw();
    });

    it('should support deleting a nested property', () => {
      const model = new Model({ a: { b: 2 } });

      expect(model.has('a.b')).to.equal(true);

      model.forget('a.b');

      expect(model.has('a.b')).to.equal(false);
    });

    it('should support deleting a specific property', () => {
      const model = new Model({ a: 1, b: 2 });

      model.forget('a');

      expect(model.has('a')).to.equal(false);
      expect(model.has('b')).to.equal(true);
    });

    it('should support deleting an array of properties', () => {
      const model = new Model({ a: 1, b: 2, c: 3 });

      model.forget(['b', 'c']);

      expect(model.has('a')).to.equal(true);
      expect(model.has('b')).to.equal(false);
      expect(model.has('c')).to.equal(false);
    });

    it('should delete all properties', () => {
      const model = new Model({ a: 1, b: 2, c: 3 });

      model.forget();
      expect(model.has('a')).to.equal(false);
      expect(model.has('b')).to.equal(false);
      expect(model.has('c')).to.equal(false);
    });
  });

  describe('clearProperties', () => {
    it('should revert properties back to defaults', () => {
      const SomeModel = class extends Model {
        static defaults() {
          return { a: 1 };
        }
      };

      const model = new SomeModel({ a: 1, b: 2, c: 3 });

      model.a = 5;
      model.clearProperties();

      // Check properties
      expect(model.a).to.equal(1);
      expect(model.b).to.be.an('undefined');
      expect(model.c).to.be.an('undefined');

      // Check originals
      expect(model.$.a).to.equal(1);
      expect(model.$.b).to.be.an('undefined');
      expect(model.$.c).to.be.an('undefined');
    });
  });

  describe('getOriginal', () => {
    it('should return saved values', () => {
      const model = new Model({ some: 1 });
      model.some = 2;
      expect(model.getOriginal('some')).to.equal(1);
    });
  });

  describe('hasMark', () => {
    it('should return true if a model has an mark', () => {
      expect((new Model(null, { a: 1 })).hasMark('a')).to.equal(true);
    });

    it('should return true if a model has an mark that is undefined', () => {
      expect((new Model(null, { a: undefined })).hasMark('a')).to.equal(true);
    });

    it('should return false if a model does not have an mark', () => {
      expect((new Model(null, { a: 1 })).hasMark('b')).to.equal(false);
    });
  });

  describe('getMark', () => {
    it('should return undefined if mark not found', () => {
      expect((new Model()).getMark('attr')).to.be.an('undefined');
    });

    it('should return value of mark if found', () => {
      expect((new Model(null, { a: 1 })).getMark('a')).to.equal(1);
    });

    it('should return default if mark not found', () => {
      expect((new Model()).getMark('b', 5)).to.equal(5);
    });

    it('should not return default if mark was found', () => {
      expect((new Model(null, { a: 1 })).getMark('a', 5)).to.equal(1);
    });
  });

  describe('setMark', () => {
    it('should set mark if it does not already exist', () => {
      const model = new Model();

      expect(model.$marks.a).to.be.an('undefined');

      model.setMark('a', 1);

      expect(model.$marks.a).to.equal(1);
    });

    it('should overwrite property if it already exists', () => {
      const model = new Model(null, { a: 1 });

      expect(model.$marks.a).to.equal(1);

      model.setMark('a', 2);

      expect(model.$marks.a).to.equal(2);
    });

    it('should emit a change event when a value has changed', (done) => {
      const model = new Model(null, { a: 1 });

      model.on('mark change', (e) => {
        expect(e.target).to.equal(model);
        expect(e.mark).to.equal('a');
        expect(e.previous).to.equal(1);
        expect(e.current).to.equal(5);
        expect(model.$marks.a).to.equal(5);
        done();
      });

      model.setMark('a', 5);
    });

    it('should not emit a change event when a value is set for the first time', () => {
      const model = new Model();

      model.on('mark change', () => {
        assert.fail('Should not have called the "mark change" event');
      });

      model.setMark('a', 1);
    });

    it('should not emit a change event when a value has not changed', () => {
      const model = new Model(null, { a: 1 });

      model.on('mark change', () => {
        assert.fail('Should not have called the "mark change" event');
      });

      model.setMark('a', 1);
    });
  });

  describe('unsetMark', () => {
    it('should revert a value to its default value', () => {
      const SomeModel = class extends Model {
        static marks() {
          return { a: 1 };
        }
      };

      const model = new SomeModel(null, { a: 5 });

      expect(model.$marks.a).to.equal(5);

      model.unsetMark('a');

      expect(model.$marks.a).to.equal(1);
    });

    it('should not fail if the property does not exist', () => {
      expect(() => (new Model()).unsetMark('a')).not.to.throw();
    });

    it('should revert a value to undefined if it does not have a default', () => {
      const model = new Model(null, { a: 1 });

      expect(model.$marks.a).to.equal(1);

      model.unsetMark('a');

      expect(model.$marks.a).to.be.an('undefined');
    });

    it('should support unsetting a specific mark', () => {
      const model = new Model(null, { a: 1, b: 2 });

      model.unsetMark('a');

      expect(model.$marks.a).to.be.an('undefined');
      expect(model.$marks.b).to.equal(2);
    });

    it('should support unsetting an array of marks', () => {
      const model = new Model(null, { a: 1, b: 2, c: 3 });

      model.unsetMark(['b', 'c']);

      expect(model.$marks.a).to.equal(1);
      expect(model.$marks.b).to.be.an('undefined');
      expect(model.$marks.c).to.be.an('undefined');
    });

    it('should revert all marks to their default values', () => {
      const SomeModel = class extends Model {
        static marks() {
          return { a: 1, b: 2, c: 3 };
        }
      };

      const model = new SomeModel();

      model.$marks.a = 10;
      model.$marks.b = 20;
      model.$marks.c = 30;

      model.unsetMark();

      expect(model.$marks.a).to.equal(1);
      expect(model.$marks.b).to.equal(2);
      expect(model.$marks.c).to.equal(3);
    });
  });

  describe('forgetMark', () => {
    it('should delete mark', () => {
      const model = new Model(null, { a: 5 });

      expect(model.hasMark('a')).to.equal(true);

      model.forgetMark('a');

      expect(model.hasMark('a')).to.equal(false);
    });

    it('should not fail if the mark does not exist', () => {
      expect(() => (new Model()).forgetMark('a')).not.to.throw();
    });

    it('should support deleting a nested mark', () => {
      const model = new Model(null, { a: { b: 2 } });

      expect(model.hasMark('a.b')).to.equal(true);

      model.forgetMark('a.b');

      expect(model.hasMark('a.b')).to.equal(false);
    });

    it('should support deleting a specific property', () => {
      const model = new Model(null, { a: 1, b: 2 });

      model.forgetMark('a');

      expect(model.hasMark('a')).to.equal(false);
      expect(model.hasMark('b')).to.equal(true);
    });

    it('should support deleting an array of marks', () => {
      const model = new Model(null, { a: 1, b: 2, c: 3 });

      model.forgetMark(['b', 'c']);

      expect(model.hasMark('a')).to.equal(true);
      expect(model.hasMark('b')).to.equal(false);
      expect(model.hasMark('c')).to.equal(false);
    });

    it('should delete all marks', () => {
      const model = new Model({ a: 1, b: 2, c: 3 });

      model.forgetMark();

      expect(model.hasMark('a')).to.equal(false);
      expect(model.hasMark('b')).to.equal(false);
      expect(model.hasMark('c')).to.equal(false);
    });
  });

  describe('clearMarks', () => {
    it('should revert marks back to defaults', () => {
      const SomeModel = class extends Model {
        static marks() {
          return { a: 1 };
        }
      };

      const model = new SomeModel(null, { a: 1, b: 2, c: 3 });

      model.$marks.a = 5;
      model.clearMarks();

      // Check marks
      expect(model.$marks.a).to.equal(1);
      expect(model.$marks.b).to.be.an('undefined');
      expect(model.$marks.c).to.be.an('undefined');
    });
  });

  describe('mutations', () => {
    it('should support an array of mutations', () => {
      const SomeModel = class extends Model {
        mutations() {
          return {
            a: [(v) => (v * 2), (v) => v.toString()],
          };
        }
      };

      const model = new SomeModel({ a: 5 }, null, { mutateOnChange: true, mutateBeforeSync: true });

      expect(model.a).to.equal('20');
    });
  });

  describe('sync', () => {
    it('should sync properties to the originals', () => {
      const model = new Model({ a: 1, b: 2 });

      expect(model.a).to.equal(1);
      expect(model.b).to.equal(2);
      expect(model.$.a).to.equal(1);
      expect(model.$.b).to.equal(2);

      model.a = 5;
      model.b = 6;

      expect(model.a).to.equal(5);
      expect(model.b).to.equal(6);
      expect(model.$.a).to.equal(1);
      expect(model.$.b).to.equal(2);

      model.sync();

      expect(model.a).to.equal(5);
      expect(model.b).to.equal(6);
      expect(model.$.a).to.equal(5);
      expect(model.$.b).to.equal(6);
    });

    it('should sync a specific property', () => {
      const model = new Model({ a: 1, b: 2 });

      expect(model.a).to.equal(1);
      expect(model.b).to.equal(2);
      expect(model.$.a).to.equal(1);
      expect(model.$.b).to.equal(2);

      model.a = 5;
      model.b = 6;

      expect(model.a).to.equal(5);
      expect(model.b).to.equal(6);
      expect(model.$.a).to.equal(1);
      expect(model.$.b).to.equal(2);

      model.sync('a');

      expect(model.a).to.equal(5);
      expect(model.b).to.equal(6);
      expect(model.$.a).to.equal(5);
      expect(model.$.b).to.equal(2);
    });

    it('should sync a an array of specific properties', () => {
      const model = new Model({ a: 1, b: 2, c: 3 });

      expect(model.a).to.equal(1);
      expect(model.b).to.equal(2);
      expect(model.c).to.equal(3);
      expect(model.$.a).to.equal(1);
      expect(model.$.b).to.equal(2);
      expect(model.$.c).to.equal(3);

      model.a = 5;
      model.b = 6;
      model.c = 7;

      expect(model.a).to.equal(5);
      expect(model.b).to.equal(6);
      expect(model.c).to.equal(7);
      expect(model.$.a).to.equal(1);
      expect(model.$.b).to.equal(2);
      expect(model.$.c).to.equal(3);

      model.sync(['a', 'c']);

      expect(model.a).to.equal(5);
      expect(model.b).to.equal(6);
      expect(model.c).to.equal(7);
      expect(model.$.a).to.equal(5);
      expect(model.$.b).to.equal(2);
      expect(model.$.c).to.equal(7);
    });

    it('should emit "sync" on sync', (done) => {
      const model = new Model();

      model.on('sync', () => {
        done();
      });

      model.sync();
    });

    it('should mutate properties before sync if option is enabled', () => {
      const SomeModel = class extends Model {
        mutations() {
          return {
            a: (v) => v.toString(),
          };
        }
      };

      const model = new SomeModel({ a: 1, b: 2 }, null, { mutateBeforeSync: true, mutateOnChange: false });

      expect(model.a).to.equal('1');
      expect(model.b).to.equal(2);

      model.a = 4;
      model.b = 5;

      expect(model.a).to.equal(4);
      expect(model.b).to.equal(5);
      expect(model.$.a).to.equal('1');
      expect(model.$.b).to.equal(2);

      model.sync();

      expect(model.a).to.equal('4');
      expect(model.b).to.equal(5);
      expect(model.$.a).to.equal('4');
      expect(model.$.b).to.equal(5);
    });

    it('should mutate specific attributes before sync if option is enabled', () => {
      const SomeModel = class extends Model {
        mutations() {
          return {
            a: (v) => v.toString(),
            b: (v) => v * 10,
          };
        }
      };

      const model = new SomeModel({ a: 1, b: 2 }, null, { mutateBeforeSync: true, mutateOnChange: false });

      expect(model.a).to.equal('1');
      expect(model.b).to.equal(20);

      model.a = 4;
      model.b = 5;

      expect(model.a).to.equal(4);
      expect(model.b).to.equal(5);
      expect(model.$.a).to.equal('1');
      expect(model.$.b).to.equal(20);

      model.sync('b');

      expect(model.a).to.equal(4);
      expect(model.b).to.equal(50);
      expect(model.$.a).to.equal('1');
      expect(model.$.b).to.equal(50);
    });

    it('should not mutate attributes before sync if option is disabled', () => {
      const SomeModel = class extends Model {
        mutations() {
          return {
            a: (v) => v.toString(),
            b: (v) => v.toString(),
          };
        }
      };

      const model = new SomeModel({ a: 1, b: 2 }, null, { mutateBeforeSync: false, mutateOnChange: false });

      expect(model.a).to.equal(1);
      expect(model.b).to.equal(2);

      model.a = 4;
      model.b = 5;

      expect(model.a).to.equal(4);
      expect(model.b).to.equal(5);
      expect(model.$.a).to.equal(1);
      expect(model.$.b).to.equal(2);

      model.sync();

      expect(model.a).to.equal(4);
      expect(model.b).to.equal(5);
      expect(model.$.a).to.equal(4);
      expect(model.$.b).to.equal(5);
    });
  });

  describe('reset', () => {
    it('should reset properties to the originals', () => {
      const model = new Model({ a: 1, b: 2 });

      expect(model.a).to.equal(1);
      expect(model.b).to.equal(2);
      expect(model.$.a).to.equal(1);
      expect(model.$.b).to.equal(2);

      model.a = 5;
      model.b = 6;

      expect(model.a).to.equal(5);
      expect(model.b).to.equal(6);
      expect(model.$.a).to.equal(1);
      expect(model.$.b).to.equal(2);

      model.reset();

      expect(model.a).to.equal(1);
      expect(model.b).to.equal(2);
      expect(model.$.a).to.equal(1);
      expect(model.$.b).to.equal(2);
    });

    it('should not mind if there are no properties', () => {
      expect(() => (new Model()).reset()).not.to.throw();
    });

    it('should not mind if already reset', () => {
      const model = new Model({ a: 1, b: 2 });
      model.a = 5;

      expect(() => model.reset()).not.to.throw();
      expect(() => model.reset()).not.to.throw();
    });

    it('should emit "reset" on reset', (done) => {
      const model = new Model();

      model.on('reset', () => {
        done();
      });

      model.reset();
    });

    it('should support resetting a specific property', () => {
      const model = new Model({ a: 1, b: 2 });
      model.a = 10;
      model.b = 20;

      model.reset('a');

      expect(model.a).to.equal(1);
      expect(model.b).to.equal(20);
    });

    it('should support resetting an array of properties', () => {
      const model = new Model({ a: 1, b: 2, c: 3 });
      model.a = 10;
      model.b = 20;
      model.c = 30;

      model.reset(['b', 'c']);

      expect(model.a).to.equal(10);
      expect(model.b).to.equal(2);
      expect(model.c).to.equal(3);
    });

    it('should not touch marks', () => {
      const model = new Model({ a: 1 }, { a: 1 });

      model.a = 4;
      model.$marks.a = 5;

      model.reset();

      expect(model.a).to.equal(1);
      expect(model.$marks.a).to.equal(5);
    });
  });

  describe('clear', () => {
    it('should revert properties back to defaults', () => {
      const SomeModel = class extends Model {
        static defaults() {
          return { a: 1 };
        }
      };

      const model = new SomeModel({ a: 1, b: 2, c: 3 });

      model.a = 5;
      model.clear();

      // Check properties
      expect(model.a).to.equal(1);
      expect(model.b).to.be.an('undefined');
      expect(model.c).to.be.an('undefined');

      // Check originals
      expect(model.$.a).to.equal(1);
      expect(model.$.b).to.an('undefined');
      expect(model.$.c).to.an('undefined');
    });

    it('should revert marks back to defaults', () => {
      const SomeModel = class extends Model {
        static marks() {
          return { a: 1 };
        }
      };

      const model = new SomeModel({}, { a: 2 });

      model.setMark('b', 2);
      model.clear();

      expect(model.$marks.a).to.equal(1);
      expect(model.$marks.b).to.be.an('undefined');
    });
  });

  describe('changed', () => {
    it('should return changed fields', () => {
      const model = new Model({ a: 1, b: 2, c: 3 });

      model.a = 6;
      expect(model.changed()).to.eql({ a: 6 });

      model.b = 7;
      expect(model.changed()).to.eql({ a: 6, b: 7 });

      model.c = 8;
      expect(model.changed()).to.eql({ a: 6, b: 7, c: 8 });
    });

    it('diff "added", should return only added fields', () => {
      const model = new Model({ a: 1, b: 2, c: 3 });

      model.a = 6;
      expect(model.changed('added')).to.equal(false);

      model.set('d', 8);
      expect(model.changed('added')).to.eql({ d: 8 });
    });

    it('diff "updated", should return only updated fields', () => {
      const model = new Model({ a: 1, b: 2, c: 3 });

      model.a = 6;
      expect(model.changed('updated')).to.eql({ a: 6 });

      model.set('d', 8);
      expect(model.changed('updated')).to.eql({ a: 6 });
    });

    it('diff "deleted", should return only deleted fields', () => {
      const model = new Model({ a: 1, b: 2, c: 3 });

      model.forget('a');
      expect(model.changed('deleted')).to.eql({ a: undefined });
    });

    it('should return nested changed fields', () => {
      const model = new Model({ a: { b: 2, c: 3 } });
      model.a.b = 5;
      expect(model.changed()).to.eql({ a: { b: 5 } });
    });

    it('should return false when there are no changed fields', () => {
      const model = new Model();
      expect(model.changed()).to.equal(false);
    });

    it('should return false after reset', () => {
      const model = new Model({ a: 1 });
      model.a = 2;
      model.reset();
      expect(model.changed()).to.equal(false);
    });

    it('should not return marks changes', () => {
      const model = new Model(null, { a: 1 });
      model.$marks.a = 2;

      expect(model.changed()).to.equal(false);
    });
  });

  describe('clone', () => {
    it('should return the clone of the model', () => {
      const model = new Model({ a: 1 });
      const clone = model.clone();

      expect(clone.a).to.equal(1);

      clone.a = 6;

      expect(model.a).to.equal(1);
      expect(clone.a).to.equal(6);
    });

    it('should clone deeply', () => {
      const model = new Model({ a: { b: 2 } });
      const clone = model.clone();

      expect(clone.a.b).to.equal(2);

      clone.a.b = 6;

      expect(model.a.b).to.equal(2);
      expect(clone.a.b).to.equal(6);
    });

    it('should clone originals', () => {
      const model = new Model({ a: 1 });
      model.a = 2;

      const clone = model.clone();

      expect(clone.a).to.equal(2);
      expect(clone.$.a).to.equal(1);
    });

    it('should clone marks', () => {
      const model = new Model(null, { a: 1 });
      const clone = model.clone();

      expect(clone.$marks.a).to.equal(1);

      clone.$marks.a = 6;

      expect(model.$marks.a).to.equal(1);
      expect(clone.$marks.a).to.equal(6);
    });
  });

  describe('toString', () => {
    it('should return the expected string representation', () => {
      const model = new Model({ a: 1 });
      expect(`${model}`).to.equal(`<${Model.name}#${model.$_uid}>`);
    });

    it('should use the class name of the extending class', () => {
      const SomeModel = class extends Model {
      };

      const model = new SomeModel();
      expect(`${model}`).to.equal(`<SomeModel#${model.$_uid}>`);
    });
  });

  describe('toJSON', () => {
    it('should convert attributes to json', () => {
      const properties = { a: 1 };
      const model = new Model(properties);

      expect(JSON.stringify(model)).to.equal(JSON.stringify(properties));
    });

    it('should honour override', () => {
      const properties = { a: 2 };
      const SomeModel = class extends Model {
        toJSON() {
          return properties;
        }
      };

      const model = new SomeModel({ a: 1 });

      expect(JSON.stringify(model)).to.equal(JSON.stringify(properties));
    });
  });
});
