import { Grid, Menu, MenuButton, MenuList, MenuItem, Card, CardHeader, CardBody, CardFooter, IconButton, Flex, Avatar, Heading, Text, Box, Button, Image } from "@chakra-ui/react";
import { HamburgerIcon, ChatIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useMutation } from "@/hooks/useMutation";
import Cookies from "js-cookie";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/router";

export default function Post() {
  // https://paace-f178cafcae7b.nevacloud.io/api/posts?type=all URL
  const [post, setPost] = useState();
  const { mutate } = useMutation();
  const userData = useContext(UserContext);

  useEffect(() => {
    async function fetchingData() {
      const response = await mutate({
        url: "https://paace-f178cafcae7b.nevacloud.io/api/posts?type=all",
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("user_token")}`,
        },
      });
      setPost(response);
    }
    fetchingData();
  }, []);

  return (
    <>
      <div className="mx-auto text-center max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {post?.data?.map((item) => (
            <Box padding={"4"}>
              <Card maxW="md">
                <CardHeader>
                  <Flex spacing="4">
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                      <Avatar name="" />

                      <Box>
                        <Heading size="sm">{item?.user?.name}</Heading>
                        <Text>{item?.user?.email}</Text>
                      </Box>
                    </Flex>
                    <Menu>
                      <MenuButton as={Button} rightIcon={<HamburgerIcon />}></MenuButton>
                      <MenuList>
                        <MenuItem>Edit</MenuItem>
                        <MenuItem>Hapus</MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Text>{item?.description}</Text>
                </CardBody>

                <CardFooter justify="space-between" flexWrap="wrap">
                  <Button flex="1" variant="ghost">
                    Like
                  </Button>
                  <Button flex="1" variant="ghost" leftIcon={<ChatIcon />}>
                    Comment
                  </Button>
                </CardFooter>
              </Card>
            </Box>
          ))}
        </Grid>
      </div>
    </>
  );
}
