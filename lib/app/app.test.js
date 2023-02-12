// To test an HTTP server
const request = require("supertest");

const { describe, it, expect } = require("@jest/globals");

const app = require("./app");

describe("The /hello endpoint", () => {
  it("Should respond with a 200", () => 
    request(app)
      .get("/hello")
      .expect(200)
    );

  it("Should respond with html text", () =>
    request(app)
      .get("/hello")
      .expect("Content-Type", /^text\/plain/));

  it("Should include Hello, world! as part of the response", () =>
    request(app)
      .get("/hello")
      .expect((res) => {
        expect(res.text.includes("Hello, world!")).toBe(true);
      }));
});

describe("Any other endpoint in the app", () => {
  it("Should respond with a 404", () =>
    request(app).get("/whatever").expect(404));

  it("Should respond with plain text", () =>
    request(app)
      .get("/whatever")
      .expect("Content-Type", /^text\/plain/));

  it("Should include Not Found as part of the response", () =>
    request(app)
      .get("/whatever")
      .expect((res) => {
        expect(res.text.includes("Not found")).toBe(true);
      }));
});

describe("The basics/birthday endpoint", () => {
  it("Should respond with a 200", () => 
    request(app).get("/basics/birthday").expect(200)
  );

  it("Should respond with HTML", () => 
    request(app)
      .get("/basics/birthday")
      .expect((res) => {
        expect(res.header["content-type"]).toBe("text/html; charset=utf-8");
      })
  );

  it("Should use defaults values", () => 
    request(app)
      .get("/basics/birthday")
      .expect((res) => {
        expect(res.text.includes("Somebody")).toBe(true);
      })
  );
});

describe("The basics/form.html endpoint", () => {
  it("Should respond with a 200", () => 
    request(app)
      .get("/basics/form.html")
      .expect(200)
  );

  it("Should respond with HTML", () =>
    request(app)
      .get("/basics/form.html")
      .expect((res) => {
        expect(res.header["content-type"]).toBe("text/html; charset=UTF-8");
    })
  );
});

describe("The basics/madlib endpoint", () => {
  it("Should redirect to form.html on GET", () => 
    request(app)
      .get("/basics/madlib")
  );

  it("Should respond with HTML on POST", () => 
    request(app)
       .post("/basics/madlib")
  );

});