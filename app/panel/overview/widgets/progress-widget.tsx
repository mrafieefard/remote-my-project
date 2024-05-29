import {
  Card,
  CardBody,
  CardHeader,
  Progress,
  Divider,
} from "@nextui-org/react";

interface props {
  title: string;
  amont: number;
}

export default function ProgressWidget(props: props) {
  return (
    <Card className="min-w-64">
      <CardHeader>
        <p className="font-bold">{props.title}</p>
      </CardHeader>
      <Divider />
      <CardBody className="flex items-center justify-center min-h-24 px-4">
        <Progress
          size="md"
          value={props.amont}
          color="primary"
          showValueLabel={true}
          className="max-w-md"
        />
      </CardBody>
    </Card>
  );
}
