import boto3


class DynamoDBClient():
    def __init__(self, table_name: str) -> None:
        client = boto3.resource('dynamodb')
        self.table_name = table_name
        self.table = client.Table(self.table_name)

    def put_record(self, data: dict) -> dict:
        res: dict = self.table.put_item(Item={
            "name": data['name'],
            "group": data['group'],
            "message": data['message']
            })

        return res
