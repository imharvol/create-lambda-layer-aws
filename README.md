# create-lambda-layer-aws

Easily and quickly create lambda layers: https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html

### Usage

```
npx create-lambda-layer-aws [PACKAGE1 PACKAGE2 ...]
```

The command will generate a file names `layer.zip`, ready to be uploaded to AWS as a layer.

### Example

```
npx create-lambda-layer-aws @aws-sdk/client-dynamodb @aws-sdk/client-sqs @aws-sdk/client-sns
```
