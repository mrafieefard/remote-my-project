import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import en from "javascript-time-ago/locale/en";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";

interface props {
  title: string;
  timestamp: number;
}

export default function TimeWidget(props: props) {
  TimeAgo.addDefaultLocale(en);
  
  const timestamp = props.timestamp.toString().length < 13 ? props.timestamp * 1000 : props.timestamp
  const date = new Date(timestamp);
  return (
    <Card className="min-w-64">
      <CardHeader>
        <p className="font-bold">{props.title}</p>
      </CardHeader>
      <Divider />
      <CardBody className="flex items-center justify-center min-h-24 px-4">
        <ReactTimeAgo date={date} timeStyle="round" />
      </CardBody>
    </Card>
  );
}
