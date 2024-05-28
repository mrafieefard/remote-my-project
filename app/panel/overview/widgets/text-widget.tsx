import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

interface props {
  title: string;
  text: string;
}

export default function TextWidget(props: props) {
  return (
    <Card className="min-w-64">
      <CardHeader>
        <p className="font-bold">{props.title}</p>
      </CardHeader>
      <Divider />
      <CardBody className="flex items-center justify-center min-h-24">
        <p>{props.text}</p>
      </CardBody>
    </Card>
  );
}
