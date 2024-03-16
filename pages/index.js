import Image from "next/image";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { Textarea, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

const LayoutComponent = dynamic(() => import("@/layout"));

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  // Start Function Add
  const [notes, setNotes] = useState({
    description: "",
  });

  const HandleSubmit = async () => {
    try {
      const response = await fetch("https://paace-f178cafcae7b.nevacloud.io/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notes),
      });
      const result = await response.json();
      if (result?.success) {
        router.reload();
      }
    } catch (error) {}
  };

  //End Function Add

  return (
    <LayoutComponent metatitle={"home"}>
      <div className="mx-auto text-center max-w-4xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <Textarea onChange={(event) => setNotes({ ...notes, description: event.target.value })} />
        <Button colorScheme="blue" mr={3} onClick={HandleSubmit}>
          Submit
        </Button>
      </div>
    </LayoutComponent>
  );
}
