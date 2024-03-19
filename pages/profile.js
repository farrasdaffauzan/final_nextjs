import Image from "next/image";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { Card, Box, CardFooter, CardHeader, Flex, Avatar, Textarea, Button, Text, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import Post from "@/components/post/profile";

const LayoutComponent = dynamic(() => import("@/layout/profile"));

const inter = Inter({ subsets: ["latin"] });

export default function Profile() {
  const userData = useContext(UserContext);
  const router = useRouter();
  const toast = useToast();
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
          Authorization: `Bearer ${Cookies.get("user_token")}`,
        },
        body: JSON.stringify(notes),
      });
      const result = await response.json();
      if (result?.success) {
        toast({
          title: "Posting Berhasil.",
          description: "Coment Berhasil Ditambahkan.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        router.reload();
      }
    } catch (error) {}
  };
  //End Function Add

  return (
    <LayoutComponent metatitle={"home"}>
      <div className="mx-auto text-center max-w-4xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <Box padding={"4"}>
          <Card maxW="">
            <CardHeader>
              <Avatar name="" />
              <Heading size="sm" padding={"3"}>
                {userData?.name}
              </Heading>
            </CardHeader>

            <CardFooter justify="space-between" flexWrap="wrap">
              <Box>
                <Heading size="sm">Email</Heading>

                {userData?.email === null && <Text> - </Text>}
                {userData?.email}
              </Box>
              <Box>
                <Heading size="sm">Hobby</Heading>
                {userData?.hobby === null && <Text> - </Text>}
                {userData?.hobby}
              </Box>
              <Box>
                <Heading size="sm">Date of Birth</Heading>
                {userData?.dob === null && <Text> - </Text>}
                {userData?.dob}
              </Box>
              <Box>
                <Heading size="sm">Phone</Heading>
                {userData?.phone === null && <Text> - </Text>}
                {userData?.phone}
              </Box>
            </CardFooter>
          </Card>
        </Box>

        <Textarea onChange={(event) => setNotes({ ...notes, description: event.target.value })} />
        <Button colorScheme="blue" mr={3} onClick={HandleSubmit}>
          Submit
        </Button>
      </div>

      <Post />
    </LayoutComponent>
  );
}
