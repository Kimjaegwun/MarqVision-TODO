import JSDOMEnvironment from "jest-environment-jsdom";

class JSDOMEnvironmentExtended extends JSDOMEnvironment {
  constructor(...args) {
    super(...args);

    this.global.TextEncoder = TextEncoder;
    this.global.Request = Request;
    this.global.Response = Response;
    this.global.fetch = fetch;
    this.global.TransformStream = TransformStream;
    this.global.BroadcastChannel = BroadcastChannel;
  }
}

export default JSDOMEnvironmentExtended;
