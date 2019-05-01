const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {
  beforeEach((done) => {
    this.wiki;
        sequelize.sync({force: true}).then((res) => {

         Wiki.create({
           title: "JS Frameworks",
           body: "There is a lot of them"
         })
          .then((wiki) => {
            this.wiki = wiki;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });

        });

  });

// #1: define the admin user context
  describe("admin(defaultvalue 1) user performing CRUD actions for Wiki", () => {

// #2: // before each test in admin user context, send an authentication request
      // to a route we will create to mock an authentication request
    beforeEach((done) => {
      User.create({
        email: "admin@example.com",
        password: "123456",
        role: 1
      })
      .then((user) => {
        request.get({         // mock authentication
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,     // mock authenticate as admin user
            userId: user.id,
            email: user.email
          }
        },
          (err, res, body) => {
            done();
          }
        );
      });
    });

    describe("GET /wikis", () => {
      it("should respond with all wikis", (done) => {
          request.get(base, (err, res, body) => {
              expect(err).toBeNull();
              expect(body).toContain("Wikis");
              expect(body).toContain("JS Frameworks");
              done();
          });
      });
  });

  describe("GET /wikis/new", () => {
      it("should render a new wiki form", (done) => {
          request.get(`${base}new`, (err, res, body) => {
              expect(err).toBeNull();
              expect(body).toContain("New Wiki");
              done();
          });
      });
  });

  describe("POST /wikis/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "blink-182 songs",
          body: "What's your favorite blink-182 song?"
        }
      };

      it("should create a new wiki and redirect", (done) => {
        request.post(options,
          (err, res, body) => {
            Wiki.findOne({where: {title: "blink-182 songs"}})
            .then((wiki) => {
              expect(wiki.title).toBe("blink-182 songs");
              expect(wiki.description).toBe("What's your favorite blink-182 song?");
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          }
        );
      });

   it("should not create a new wiki that fails validations", (done) => {
     const options = {
       url: `${base}/create`,
       form: {
         title: "a",
         description: "b"
       }
     };
     request.post(options,
       (err, res, body) => {
         Wiki.findOne({where: {title: "a"}})
         .then((wiki) => {
           console.log(wiki);
             expect(wiki).toBeNull();
             done();
         })
         .catch((err) => {
           console.log(err);
           done();
         });
       }
     );
   });
    });
    describe("GET /wikis/:id", () => {
        it("should render a view with the selected wiki", (done) => {
            request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("JS Frameworks");
                done();
            });
        });
    });
    describe("POST /wikis/:id/destroy", () => {

      it("should delete the wiki with the associated ID", (done) => {
        Wiki.all()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;

          expect(wikiCountBeforeDelete).toBe(1);
          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.all()
            .then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
              done();
            })

          });
        });

      });

    });
    describe("GET /wikis/:id/edit", () => {

      it("should render a view with an edit wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });

    });
    describe("POST /wikis/:id/update", () => {

      it("should update the wiki with the given values", (done) => {
         const options = {
            url: `${base}${this.wiki.id}/update`,
            form: {
              title: "JavaScript Frameworks",
              body: "There are a lot of them"
            }
          };
          request.post(options,
            (err, res, body) => {
            expect(err).toBeNull();
            Wiki.findOne({
              where: { id: this.wiki.id }
            })
            .then((wiki) => {
              expect(wiki.title).toBe("JavaScript Frameworks");
              done();
            });
          });
      });

    });
  })

// #3: define the member user context
  describe("standard member(defaultvalue) user performing CRUD actions for Wiki", () => {

// #4: Send mock request and authenticate as a member user
    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: 0
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });

    describe("GET /wikis", () => {
      it("should return all wikis", (done) => {
          request.get(base, (err, res, body) => {
              expect(err).toBeNull();
              expect(body).toContain("Wikis");
              expect(body).toContain("JS Frameworks");
              done();
          });
      });
  });

  describe("GET /wikis/new", () => {
      it("should render a new wiki form", (done) => {
          request.get(`${base}new`, (err, res, body) => {
              expect(err).toBeNull();
              expect(body).toContain("Wikis");
              done();
          });
      });
  });

  describe("POST /wikis/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "blink-182 songs",
          body: "What's your favorite blink-182 song?"
        }
      };

      it("should not create a new wiki", (done) => {
        request.post(options,
          (err, res, body) => {
            Wiki.findOne({where: {title: "blink-182 songs"}})
            .then((wiki) => {
              expect(wiki).toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          }
        );
      });
    });
    describe("GET /wikis/:id", () => {
        it("should render a view with the selected wiki", (done) => {
            request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("JS Frameworks");
                done();
            });
        });
    });
    describe("POST /wikis/:id/destroy", () => {

      it("should not delete the wiki with the associated ID", (done) => {
        Wiki.all()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(1);
          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.all()
            .then((wikis) => {
              // confirm that no wikis were deleted
              expect(wikiss.length).toBe(wikiCountBeforeDelete);
              done();
            })

          });
        });

      });

    });
    describe("GET /wikis/:id/edit", () => {

      it("should not render a view with an edit wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("Edit Wiki");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });

    });
    describe("POST /wikis/:id/update", () => {

      it("should not update the wiki with the given values", (done) => {
         const options = {
            url: `${base}${this.wiki.id}/update`,
            form: {
              title: "JavaScript Frameworks",
              body: "There are a lot of them"
            }
          };
          request.post(options,
            (err, res, body) => {
            expect(err).toBeNull();
            Wiki.findOne({
              where: { id: this.wiki.id }
            })
            .then((wiki) => {
              expect(wiki.title).toBe("JS Frameworks"); //confirm title is not changed
              done();
            });
          });
      });

    });
  });
}); // end of test
