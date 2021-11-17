// eslint-disable-next-line max-classes-per-file
import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';
import HttpModel, { supportStaticRequests } from '@/models/BaseHttp';

global.localStorage = {};

describe('models/BaseHttp.js (HttpModel)', () => {
  describe('$http', () => {
    it('should define methods', () => {
      const httpModel = new class extends HttpModel {
        static options() {
          return {
            http: {
              methods: {
                a: { route: '/a' },
              },
            },
          };
        }
      }(null, null, { http: { methods: { b: { route: '/c' } } } });

      expect(httpModel.$http.a, 'Http function a').to.be.a('function');
      expect(httpModel.$http.b, 'Http function b').to.be.a('function');
    });

    it('should define static methods', () => {
      class TestHttpModel extends HttpModel {
        static options() {
          return { http: { methods: { a: { route: '/a', static: true } } } };
        }
      }

      supportStaticRequests(TestHttpModel);

      expect(TestHttpModel.$http.a, 'Http function a').to.be.a('function');
    });
  });

  describe('getHttpUrl', () => {
    it('should replace replacement with properties', () => {
      const definition = { route: '{id}/test-{path.something}' };
      const data = { id: 1, path: { something: 'something' } };

      const httpModel = new HttpModel(data);

      expect(httpModel.getHttpURL(definition)).to.equal(`/${data.id}/test-${data.path.something}`);
    });

    it('should replace replacement with originals', () => {
      const definition = { route: '{$.id}/test-{$.path.something}' };
      const data = { id: 1, path: { something: 'something' } };

      const httpModel = new HttpModel(data);
      httpModel.id = 2;
      httpModel.path = { something: 'gnihtemos' };

      expect(httpModel.getHttpURL(definition)).to.equal(`/${data.id}/test-${data.path.something}`);
    });

    it('should combine baseRoute with route', () => {
      const baseRoute = 'http://example.com';
      const definition = { route: '{id}/test-{path.something}' };
      const data = { id: 1, path: { something: 'something' } };

      const httpModel = new HttpModel(data, null, { http: { base: { route: baseRoute } } });

      expect(httpModel.getHttpURL(definition)).to.equal(`${baseRoute}/${data.id}/test-${data.path.something}`);
    });

    it('should ignore baseRoute if route start with /', () => {
      const baseRoute = 'http://example.com';
      const definition = { route: '/{id}/test-{path.something}' };
      const data = { id: 1, path: { something: 'something' } };

      const httpModel = new HttpModel(data, null, { http: { base: { route: baseRoute } } });

      expect(httpModel.getHttpURL(definition)).to.equal(`/${data.id}/test-${data.path.something}`);
    });
  });

  describe('static getHttpUrl', () => {
    it('should replace replacement with properties', () => {
      const definition = { route: '{id}/test-{path.something}' };
      const data = { id: 1, path: { something: 'something' } };

      expect(HttpModel.getHttpURL(definition, data)).to.equal(`/${data.id}/test-${data.path.something}`);
    });

    it('should combine baseRoute with route', () => {
      const baseRoute = 'http://example.com';
      const definition = { route: '{id}/test-{path.something}' };
      const data = { id: 1, path: { something: 'something' } };

      class TestHttpModel extends HttpModel {
        static options() {
          return { http: { base: { route: baseRoute } } };
        }
      }

      expect(TestHttpModel.getHttpURL(definition, data))
        .to.equal(`${baseRoute}/${data.id}/test-${data.path.something}`);
    });

    it('should ignore baseRoute if route start with /', () => {
      const baseRoute = 'http://example.com';
      const definition = { route: '/{id}/test-{path.something}' };
      const data = { id: 1, path: { something: 'something' } };

      class TestHttpModel extends HttpModel {
        static options() {
          return { http: { base: { route: baseRoute } } };
        }
      }

      expect(TestHttpModel.getHttpURL(definition, data))
        .to.equal(`/${data.id}/test-${data.path.something}`);
    });
  });

  describe('getHttpHeaders', () => {
    it('should merge base headers with headers', async () => {
      const definition = { headers: { a: 'a', b: 'b' } };

      const httpModel = new class extends HttpModel {
        static options() {
          return { http: { base: { headers: { a: 'b', c: 'c' } } } };
        }
      }(null, null, { http: { base: { headers: { a: 'c', z: 'z' } } } });

      expect(await httpModel.getHttpHeaders(definition)).to.eql({ a: 'a', b: 'b', c: 'c', z: 'z' });
    });

    it('should support defining headers as a function ', async () => {
      const definition = { headers: () => ({ a: 'a' }) };

      const httpModel = new class extends HttpModel {
        static options() {
          return { http: { base: { headers: () => ({ a: 'b', b: 'b' }) } } };
        }
      }();

      expect(await httpModel.getHttpHeaders(definition)).to.eql({ a: 'a', b: 'b' });
    });

    it('should support defining headers as an async function ', async () => {
      const definition = {
        headers: async () => new Promise((s) => {
          setTimeout(() => {
            s({ a: 'a' });
          }, 0);
        }),
      };

      const httpModel = new class extends HttpModel {
        static options() {
          return {
            http: {
              base: {
                headers: () => new Promise((s) => {
                  setTimeout(() => {
                    s({ a: 'b', b: 'b' });
                  }, 0);
                }),
              },
            },
          };
        }
      }();
      expect(await httpModel.getHttpHeaders(definition)).to.eql({ a: 'a', b: 'b' });
    });

    it('should have definition argument', async () => {
      const definition = {
        headers(d) {
          expect(d).to.equal(definition);
          return { a: this.a };
        },
      };

      await (new HttpModel()).getHttpData(definition);
    });

    it('should use HttpModel "this"', async () => {
      const httpModel = new HttpModel();
      const definition = {
        headers() {
          expect(this).to.equal(httpModel);
          return { a: this.a };
        },
      };

      await httpModel.getHttpData(definition);
    });
  });

  describe('static getHttpHeaders', () => {
    it('should merge base headers with headers', async () => {
      const definition = { headers: { a: 'a', b: 'b' } };

      class TestHttpModel extends HttpModel {
        static options() {
          return { http: { base: { headers: { a: 'b', c: 'c' } } } };
        }
      }

      expect(await TestHttpModel.getHttpHeaders(definition)).to.eql({ a: 'a', b: 'b', c: 'c' });
    });

    it('should support defining headers as a function ', async () => {
      const definition = { headers: () => ({ a: 'a', b: 'b' }) };

      class TestHttpModel extends HttpModel {
        static options() {
          return { http: { base: { headers: () => ({ a: 'b', c: 'c' }) } } };
        }
      }

      expect(await TestHttpModel.getHttpHeaders(definition)).to.eql({ a: 'a', b: 'b', c: 'c' });
    });

    it('should support defining headers as an async function ', async () => {
      const definition = {
        headers: () => new Promise((s) => {
          setTimeout(() => {
            s({ a: 'a', b: 'b' });
          }, 0);
        }),
      };

      class TestHttpModel extends HttpModel {
        static options() {
          return {
            http: {
              base: {
                headers: () => new Promise((s) => {
                  setTimeout(() => {
                    s({ a: 'b', c: 'c' });
                  }, 0);
                }),
              },
            },
          };
        }
      }

      expect(await TestHttpModel.getHttpHeaders(definition)).to.eql({ a: 'a', b: 'b', c: 'c' });
    });

    it('should have definition argument', async () => {
      const definition = {
        headers(d) {
          expect(d, 'route headers').to.equal(definition);
          return { a: this.a };
        },
      };

      class TestHttpModel extends HttpModel {
        static options() {
          return {
            http: {
              base: {
                headers(d) {
                  expect(d, 'base headers').to.equal(definition);
                  return { b: this.b };
                },
              },
            },
          };
        }
      }

      await TestHttpModel.getHttpHeaders(definition);
    });

    it('should use HttpModel "this"', async () => {
      class TestHttpModel extends HttpModel {
        static options() {
          return {
            http: {
              base: {
                headers() {
                  expect(this, 'base headers').to.equal(TestHttpModel);
                  return { b: this.b };
                },
              },
            },
          };
        }
      }

      const definition = {
        headers() {
          expect(this, 'route headers').to.equal(TestHttpModel);
          return { a: this.a };
        },
      };

      await TestHttpModel.getHttpHeaders(definition);
    });
  });

  describe('getHttpData', () => {
    describe('only', () => {
      it('should only return the listed properties ', async () => {
        const definition = { data: { only: ['a', 'c'] } };
        const data = { a: 'a', b: 'b', c: 'c' };

        const httpModel = new HttpModel(data);

        expect(await httpModel.getHttpData(definition)).to.eql({ a: data.a, c: data.c });
      });

      it('should support definition as function', async () => {
        const definition = {
          data: {
            only: () => ['a', 'c'],
          },
        };

        const data = { a: 'a', b: 'b', c: 'c' };

        const httpModel = new HttpModel(data);

        expect(await httpModel.getHttpData(definition)).to.eql({ a: data.a, c: data.c });
      });

      it('should support definition as async function', async () => {
        const definition = {
          data: {
            only: async () => new Promise((s) => {
              setTimeout(() => {
                s(['a', 'c']);
              }, 0);
            }),
          },
        };

        const data = { a: 'a', b: 'b', c: 'c' };

        const httpModel = new HttpModel(data);

        expect(await httpModel.getHttpData(definition)).to.eql({ a: data.a, c: data.c });
      });

      it('should have definition argument', async () => {
        const httpModel = new HttpModel();

        const definition = {
          data: {
            only({ definition: d }) {
              expect(d).to.equal(definition);
              return ['a', 'c'];
            },
          },
        };

        await httpModel.getHttpData(definition);
      });

      it('should have properties argument', async () => {
        const data = { a: 'a', b: 'b' };

        const httpModel = new HttpModel(data);

        const definition = {
          data: {
            only({ properties }) {
              expect(properties).to.eql(data);
              return ['a', 'c'];
            },
          },
        };

        await httpModel.getHttpData(definition);
      });

      it('should use HttpModel "this"', async () => {
        const data = { a: 'a', b: 'b', c: 'c' };

        const httpModel = new HttpModel(data);

        const definition = {
          data: {
            only() {
              expect(this).to.equal(httpModel);

              return new Promise((s) => {
                setTimeout(() => {
                  s(['a', 'c']);
                }, 0);
              });
            },
          },
        };

        await httpModel.getHttpData(definition);
      });
    });

    describe('with', () => {
      it('should return with properties', async () => {
        const wth = { x: 'x', y: 'y' };
        const data = { a: 'a' };
        const definition = { data: { with: wth } };

        const httpModel = new HttpModel(data);

        expect(await httpModel.getHttpData(definition)).to.eql({ a: data.a, ...wth });
      });

      it('should support definition as function', async () => {
        const wth = { x: 'x', y: 'y' };
        const data = { a: 'a' };
        const definition = { data: { with: wth } };

        const httpModel = new HttpModel(data);

        expect(await httpModel.getHttpData(definition)).to.eql({ a: data.a, ...wth });
      });

      it('should support definition as async function', async () => {
        const wth = { x: 'x', y: 'y' };
        const data = { a: 'a' };
        const definition = {
          data: {
            with: async () => new Promise((s) => {
              setTimeout(() => {
                s(wth);
              }, 0);
            }),
          },
        };

        const httpModel = new HttpModel(data);

        expect(await httpModel.getHttpData(definition)).to.eql({ a: data.a, ...wth });
      });

      it('should have definition argument', async () => {
        const definition = {
          data: {
            with({ definition: d }) {
              expect(d).to.equal(definition);
              return { x: 'x', y: 'y' };
            },
          },
        };

        await (new HttpModel()).getHttpData(definition);
      });

      it('should have properties argument', async () => {
        const data = { a: 'a', b: 'b' };

        const httpModel = new HttpModel(data);

        const definition = {
          data: {
            with({ properties }) {
              expect(properties).to.eql(data);
              return { a: 'a' };
            },
          },
        };

        await httpModel.getHttpData(definition);
      });

      it('should use HttpModel "this"', async () => {
        const httpModel = new HttpModel();

        const definition = {
          data: {
            with() {
              expect(this).to.equal(httpModel);
              return { x: 'x', y: 'y' };
            },
          },
        };

        await httpModel.getHttpData(definition);
      });
    });

    describe('without', () => {
      it('should return without properties', async () => {
        const without = ['a'];
        const data = { a: 'a', x: 'x', y: 'y' };
        const definition = { data: { without } };

        const httpModel = new HttpModel(data);

        expect(await httpModel.getHttpData(definition)).to.have.keys('x', 'y');
      });

      it('should support definition as function', async () => {
        const without = () => ['a'];
        const data = { a: 'a', x: 'x', y: 'y' };
        const definition = { data: { without } };

        const httpModel = new HttpModel(data);

        expect(await httpModel.getHttpData(definition)).to.have.keys('x', 'y');
      });

      it('should support definition as async function', async () => {
        const without = async () => new Promise((s) => {
          setTimeout(() => {
            s(['a']);
          }, 0);
        });
        const data = { a: 'a', x: 'x', y: 'y' };
        const definition = { data: { without } };

        const httpModel = new HttpModel(data);

        expect(await httpModel.getHttpData(definition)).to.have.keys('x', 'y');
      });

      it('should have definition argument', async () => {
        const definition = {
          data: {
            without({ definition: d }) {
              expect(d).to.equal(definition);
              return ['a'];
            },
          },
        };

        await (new HttpModel()).getHttpData(definition);
      });

      it('should have properties argument', async () => {
        const data = { a: 'a', b: 'b' };

        const httpModel = new HttpModel(data);

        const definition = {
          data: {
            with({ properties }) {
              expect(properties).to.eql(data);
              return { a: 'a' };
            },
          },
        };

        await httpModel.getHttpData(definition);
      });

      it('should use HttpModel "this"', async () => {
        const httpModel = new HttpModel();

        const definition = {
          data: {
            without() {
              expect(this).to.equal(httpModel);
              return ['a'];
            },
          },
        };

        await httpModel.getHttpData(definition);
      });
    });

    describe('data as custom function', () => {
      it('should return properties', async () => {
        const definition = {
          data() {
            return { c: this.a };
          },
        };
        const data = { a: 'a', b: 'b', c: 'c' };

        const httpModel = new HttpModel(data);

        expect(await httpModel.getHttpData(definition)).to.eql({ c: data.a });
      });

      it('should have definition argument', async () => {
        const definition = {
          data({ definition: d }) {
            expect(d).to.equal(definition);
            return {};
          },
        };

        await (new HttpModel()).getHttpData(definition);
      });

      it('should have properties argument', async () => {
        const data = { a: 'a', b: 'b' };

        const definition = {
          data({ properties }) {
            expect(properties).to.eql(data);
            return {};
          },
        };

        await (new HttpModel(data)).getHttpData(definition);
      });
    });
  });

  describe('static getHttpData', () => {
    describe('only', () => {
      it('should only return the listed properties ', async () => {
        const definition = { data: { only: ['a', 'c'] } };
        const data = { a: 'a', b: 'b', c: 'c' };

        expect(await HttpModel.getHttpData(definition, data)).to.eql({ a: data.a, c: data.c });
      });

      it('should support definition as function', async () => {
        const definition = {
          data: {
            only: () => ['a', 'c'],
          },
        };

        const data = { a: 'a', b: 'b', c: 'c' };

        expect(await HttpModel.getHttpData(definition, data)).to.eql({ a: data.a, c: data.c });
      });

      it('should support definition as async function', async () => {
        const definition = {
          data: {
            only: async () => new Promise((s) => {
              setTimeout(() => {
                s(['a', 'c']);
              }, 0);
            }),
          },
        };

        const data = { a: 'a', b: 'b', c: 'c' };

        expect(await HttpModel.getHttpData(definition, data)).to.eql({ a: data.a, c: data.c });
      });

      it('should have definition argument', async () => {
        const definition = {
          data: {
            only({ definition: d }) {
              expect(d).to.equal(definition);
              return ['a', 'c'];
            },
          },
        };

        await HttpModel.getHttpData(definition);
      });

      it('should have properties argument', async () => {
        const data = { a: 'a', b: 'b' };

        const definition = {
          data: {
            only({ properties }) {
              expect(properties).to.eql(data);
              return ['a', 'c'];
            },
          },
        };

        await HttpModel.getHttpData(definition, data);
      });

      it('should use HttpModel "this"', async () => {
        const definition = {
          data: {
            only() {
              expect(this).to.equal(HttpModel);

              return new Promise((s) => {
                setTimeout(() => {
                  s(['a', 'c']);
                }, 0);
              });
            },
          },
        };

        await HttpModel.getHttpData(definition);
      });
    });

    describe('with', () => {
      it('should return with properties', async () => {
        const wth = { x: 'x', y: 'y' };
        const data = { a: 'a' };
        const definition = { data: { with: wth } };

        expect(await HttpModel.getHttpData(definition, data)).to.eql({ a: data.a, ...wth });
      });

      it('should support definition as function', async () => {
        const wth = { x: 'x', y: 'y' };
        const data = { a: 'a' };
        const definition = { data: { with: wth } };

        expect(await HttpModel.getHttpData(definition, data)).to.eql({ a: data.a, ...wth });
      });

      it('should support definition as async function', async () => {
        const wth = { x: 'x', y: 'y' };
        const data = { a: 'a' };
        const definition = {
          data: {
            with: async () => new Promise((s) => {
              setTimeout(() => {
                s(wth);
              }, 0);
            }),
          },
        };

        expect(await HttpModel.getHttpData(definition, data)).to.eql({ a: data.a, ...wth });
      });

      it('should have definition argument', async () => {
        const definition = {
          data: {
            with({ definition: d }) {
              expect(d).to.equal(definition);
              return { x: 'x', y: 'y' };
            },
          },
        };

        await HttpModel.getHttpData(definition);
      });

      it('should have properties argument', async () => {
        const data = { a: 'a', b: 'b' };

        const definition = {
          data: {
            with({ properties }) {
              expect(properties).to.eql(data);
              return { a: 'a' };
            },
          },
        };

        await HttpModel.getHttpData(definition, data);
      });

      it('should use HttpModel "this"', async () => {
        const definition = {
          data: {
            with() {
              expect(this).to.equal(HttpModel);
              return { x: 'x', y: 'y' };
            },
          },
        };

        await HttpModel.getHttpData(definition);
      });
    });

    describe('without', () => {
      it('should return without properties', async () => {
        const without = ['a'];
        const data = { a: 'a', x: 'x', y: 'y' };
        const definition = { data: { without } };

        expect(await HttpModel.getHttpData(definition, data)).to.have.keys('x', 'y');
      });

      it('should support definition as function', async () => {
        const without = () => ['a'];
        const data = { a: 'a', x: 'x', y: 'y' };
        const definition = { data: { without } };

        expect(await HttpModel.getHttpData(definition, data)).to.have.keys('x', 'y');
      });

      it('should support definition as async function', async () => {
        const without = async () => new Promise((s) => {
          setTimeout(() => {
            s(['a']);
          }, 0);
        });
        const data = { a: 'a', x: 'x', y: 'y' };
        const definition = { data: { without } };

        expect(await HttpModel.getHttpData(definition, data)).to.have.keys('x', 'y');
      });

      it('should have definition argument', async () => {
        const definition = {
          data: {
            without({ definition: d }) {
              expect(d).to.equal(definition);
              return ['a'];
            },
          },
        };

        await (new HttpModel()).getHttpData(definition);
      });

      it('should have properties argument', async () => {
        const data = { a: 'a', b: 'b' };

        const definition = {
          data: {
            with({ properties }) {
              expect(properties).to.eql(data);
              return { a: 'a' };
            },
          },
        };

        await HttpModel.getHttpData(definition, data);
      });

      it('should use HttpModel "this"', async () => {
        const definition = {
          data: {
            without() {
              expect(this).to.equal(HttpModel);
              return ['a'];
            },
          },
        };

        await HttpModel.getHttpData(definition);
      });
    });

    describe('data as custom function', () => {
      it('should return properties', async () => {
        const definition = {
          data() {
            return { c: this.a };
          },
        };

        HttpModel.a = 'a';

        expect(await HttpModel.getHttpData(definition)).to.eql({ c: HttpModel.a });
      });

      it('should have definition argument', async () => {
        const definition = {
          data({ definition: d }) {
            expect(d).to.equal(definition);
            return {};
          },
        };

        await HttpModel.getHttpData(definition);
      });

      it('should have properties argument', async () => {
        const data = { a: 'a', b: 'b' };

        const definition = {
          data({ properties }) {
            expect(properties).to.eql(data);
            return {};
          },
        };

        await HttpModel.getHttpData(definition, data);
      });
    });
  });

  describe('sendRequest', () => {
    describe('apply', () => {
      it('should apply properties', async () => {
        const httpModel = new HttpModel({ a: 'a', b: 'b' }, null, {
          http: {
            methods: {
              get: {
                route: '/get',
                method: 'GET',
                apply: true,
              },
            },
          },
        });

        const mock = new MockAdapter(httpModel.getOption('http.client'));

        mock.onGet('/get').reply(() => [200, { a: 'b', b: 'a' }]);

        await httpModel.$http.get();

        expect(httpModel.$properties).to.eql({ a: 'b', b: 'a' });
      });

      it('should support definition as function', async () => {
        const httpModel = new HttpModel({ a: 'a', b: 'b' }, null, {
          http: {
            methods: {
              get: {
                route: '/get',
                method: 'GET',
                apply({ response: { data } }) {
                  return { a: data.a };
                },
              },
            },
          },
        });

        const mock = new MockAdapter(httpModel.getOption('http.client'));

        mock.onGet('/get').reply(() => [200, { a: 'b', b: 'a' }]);

        await httpModel.$http.get();

        expect(httpModel.$properties).to.eql({ a: 'b', b: 'b' });
      });

      it('should have definition argument', async () => {
        const definition = {
          route: '/get',
          method: 'GET',
          apply({ definition: d }) {
            expect(d).to.eql(definition);
            return { a: 'b' };
          },
        };

        const httpModel = new HttpModel({ a: 'a', b: 'b' }, null, {
          http: {
            methods: {
              get: definition,
            },
          },
        });

        const mock = new MockAdapter(httpModel.getOption('http.client'));

        mock.onGet('/get').reply(() => [200, { a: 'b', b: 'a' }]);

        await httpModel.$http.get();
      });

      it('should have response argument', async () => {
        const definition = {
          route: '/get',
          method: 'GET',
          apply({ response }) {
            // eslint-disable-next-line no-unused-expressions
            expect(response).to.not.be.empty;
            return { a: 'b' };
          },
        };

        const httpModel = new HttpModel({ a: 'a', b: 'b' }, null, {
          http: {
            methods: {
              get: definition,
            },
          },
        });

        const mock = new MockAdapter(httpModel.getOption('http.client'));

        mock.onGet('/get').reply(() => [200, { a: 'b', b: 'a' }]);

        await httpModel.$http.get();
      });
    });

    describe('sync', () => {
      it('should sync properties', async () => {
        const httpModel = new HttpModel({ a: 'a', b: 'b' }, null, {
          http: {
            methods: {
              get: {
                route: '/get',
                method: 'GET',
                apply: true,
                sync: true,
              },
            },
          },
        });

        const mock = new MockAdapter(httpModel.getOption('http.client'));

        mock.onGet('/get').reply(() => [200, { a: 'b', b: 'a' }]);

        await httpModel.$http.get();

        expect(httpModel.$).to.eql({ a: 'b', b: 'a' });
      });

      it('should support definition as function', async () => {
        const httpModel = new HttpModel({ a: 'a', b: 'b' }, null, {
          http: {
            methods: {
              get: {
                route: '/get',
                method: 'GET',
                apply: true,
                sync() {
                  return ['a'];
                },
              },
            },
          },
        });

        const mock = new MockAdapter(httpModel.getOption('http.client'));

        mock.onGet('/get').reply(() => [200, { a: 'b', b: 'a' }]);

        await httpModel.$http.get();

        expect(httpModel.$).to.eql({ a: 'b', b: 'b' });
      });

      it('should have definition argument', async () => {
        const definition = {
          route: '/get',
          method: 'GET',
          sync({ definition: d }) {
            expect(d).to.eql(definition);
            return ['a'];
          },
        };

        const httpModel = new HttpModel({ a: 'a', b: 'b' }, null, {
          http: {
            methods: {
              get: definition,
            },
          },
        });

        const mock = new MockAdapter(httpModel.getOption('http.client'));

        mock.onGet('/get').reply(() => [200, { a: 'b', b: 'a' }]);

        await httpModel.$http.get();
      });

      it('should have response argument', async () => {
        const definition = {
          route: '/get',
          method: 'GET',
          async({ response }) {
            // eslint-disable-next-line no-unused-expressions
            expect(response).to.not.be.empty;
            return ['a'];
          },
        };

        const httpModel = new HttpModel({ a: 'a', b: 'b' }, null, {
          http: {
            methods: {
              get: definition,
            },
          },
        });

        const mock = new MockAdapter(httpModel.getOption('http.client'));

        mock.onGet('/get').reply(() => [200, { a: 'b', b: 'a' }]);

        await httpModel.$http.get();
      });
    });

    describe('returns', () => {
      it('should return data', async () => {
        const httpModel = new HttpModel();

        httpModel.assignHttp({
          get: {
            route: '/get',
            method: 'GET',
            returns() {
              return 'some-data';
            },
          },
        });

        const mock = new MockAdapter(httpModel.getOption('http.client'));

        mock.onGet('/get').reply(200);

        await httpModel.$http.get();

        expect(await httpModel.$http.get()).to.equal('some-data');
      });

      it('should have definition argument', async () => {
        const definition = {
          route: '/get',
          method: 'GET',
          returns({ definition: d }) {
            expect(d).to.eql(definition);
            return 'some-data';
          },
        };

        const httpModel = new HttpModel();

        httpModel.assignHttp({ get: definition });

        const mock = new MockAdapter(httpModel.getOption('http.client'));

        mock.onGet('/get').reply(200);

        await httpModel.$http.get();
      });

      it('should have response argument', async () => {
        const httpModel = new HttpModel();

        httpModel.assignHttp({
          get: {
            route: '/get',
            method: 'GET',
            returns({ response }) {
              // eslint-disable-next-line no-unused-expressions
              expect(response).to.not.be.empty;
              return 'some-data';
            },
          },
        });

        const mock = new MockAdapter(httpModel.getOption('http.client'));

        mock.onGet('/get').reply(200);

        await httpModel.$http.get();
      });
    });
  });
});
