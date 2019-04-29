const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;


describe("Wiki", () => {

  beforeEach((done) => {
       this.wiki;

       this.user;

       sequelize.sync({force: true}).then((res) => {

         User.create({
           email: "starman@tesla.com",
           password: "Trekkie4lyfe"
         })
         .then((user) => {
           this.user = user;


           Wiki.create({
             title: "Expeditions to Alpha Centauri",
             body: "A compilation of reports from recent visits to the star system.",


           }
           .then((wiki) => {
             this.wiki = wiki;

             done();
           })
         })
       });
     });






     describe("#setUser()", () => {

         it("should associate a post and a user together", (done) => {

           User.create({
             email: "ada@example.com",
             password: "password"
           })
           .then((newUser) => {

             expect(this.wiki.userId).toBe(this.user.id);

             this.wiki.setUser(newUser)
             .then((wiki) => {

               expect(this.wiki.userId).toBe(newUser.id);
               done();

             });
           })
         });

       });

       describe("#getUser()", () => {

         it("should return the associated wiki", (done) => {

           this.post.getUser()
           .then((associatedUser) => {
             expect(associatedUser.email).toBe("starman@tesla.com");
             done();
           });

         });

       });








});
