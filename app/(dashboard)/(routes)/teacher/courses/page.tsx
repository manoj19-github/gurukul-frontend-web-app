import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { FC } from "react";

interface CoursesPageProps {}
const CoursesPage: FC<CoursesPageProps> = (): JSX.Element => {
  return (
    <div className="p-5">
      <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link>
    </div>
  );
};

export default CoursesPage;
