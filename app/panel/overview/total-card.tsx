import { Card, CardBody, CardHeader } from "@nextui-org/react";

interface props {
    title : string
    count : number
    
}

export default function TotalCard(props : props) {
  return (
    <Card className="md:min-w-[150px]">
      <CardHeader>
        <p className="font-bold">{props.title}</p>
      </CardHeader>
      <CardBody className="flex justify-center items-center">
        <p className="text-2xl">{props.count}</p>
      </CardBody>
    </Card>
  );
}
