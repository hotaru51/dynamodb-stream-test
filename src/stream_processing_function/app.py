import json
import logging

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def handler(event, context):
    logger.info('receive stream event: {}'.format(json.dumps(event)))

    return {"statusCode": 200}
