import os
import json
import logging

from client import DynamoDBClient

TABLE_NAME: str = os.environ.get('TABLE_NAME', '')

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def handler(event, context):
    logger.info('receive event: {}'.format(json.dumps(event)))

    data: dict = json.loads(event['body'])
    logger.info('receive data: {}'.format(json.dumps(data)))

    table = DynamoDBClient(TABLE_NAME)
    table.put_record(data)

    return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"msg": "ok"})}
