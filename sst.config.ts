/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "abet-test",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "eu-central-1"
        }
      }
    };
  },
  async run() {
    // new sst.aws.Nextjs("MyWeb");
    const bucket = new sst.aws.Bucket("TestBucket", {
      public: true
    });
  },
});
