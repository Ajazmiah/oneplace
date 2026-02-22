import React from "react";
import { Card, CardContent } from "@/Components/ui/card";

function StatusCard({ applicationStatus, applications }) {
  return (
    <>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Applications</p>
          <p className="text-2xl font-bold">{`${applications.length}`}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Interviewing</p>
          <p className="text-2xl font-bold">{applicationStatus.interviewing}</p>
        </CardContent>
      </Card>
      <Card className="">
        <CardContent className="p-4">
          <p className="text-sm">Offers Received</p>
          <p className="text-2xl font-bold">{applicationStatus.offer}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm">Rejections</p>
          <p className="text-2xl font-bold">{applicationStatus["rejected"]}</p>
        </CardContent>
      </Card>
    </>
  );
}

export default StatusCard;
