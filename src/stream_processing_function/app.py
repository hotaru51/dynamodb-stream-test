from hashlib import new
import os
import json
import logging
from typing import Any

import boto3

TOPIC_ARN = os.environ.get('TOPIC_ARN')

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

topic = boto3.resource('sns').Topic(TOPIC_ARN)


def handler(event, context):
    logger.info('receive stream event: {}'.format(json.dumps(event)))

    stream_records: list[dict[str, Any]] = event['Records']
    for r in stream_records:
        message = build_sns_body(r['dynamodb']['NewImage'])
        logger.info('publish message: {}'.format(json.dumps(message)))
        topic.publish(Subject=message['Subject'], Message=message['Message'])

    return {"statusCode": 200}


def build_sns_body(new_image: dict[str, Any]):
    name = new_image['name']['S']
    group = new_image['group']['S']
    message = new_image['message']['S']

    body = '''
新しいメンバーが追加されました。

name: {name}
group: {group}
message: {message}
'''.format(name=name, group=group, message=message).strip()

    return {
            "Subject": "新しいメンバーが追加されました。",
            "Message": body
            }
