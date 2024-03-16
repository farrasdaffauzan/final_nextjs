import { Flex, Stack, Heading, FormControl, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import { useToast } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Login() {
  const { mutate } = useMutation();
  const toast = useToast();
  const router = useRouter();

  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    const response = await mutate({ url: "https://paace-f178cafcae7b.nevacloud.io/api/login", payload });
    if (!response?.success) {
      toast({
        title: "Login Gagal.",
        description: "Email dan password tidak sesuai.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      Cookies.set("user_token", response?.data?.token, { expires: new Date(response?.data?.expires_at), path: "/" });
      router.push("/");
    }
    console.log("Respone => ", response);
  };

  return (
    <div>
      <Flex alignItems={"center"} justifyContent={"center"}>
        <Stack direction={"column"}>
          <Heading as="h4">LOGIN</Heading>
          <FormControl>
            <Input placeholder="email" value={payload?.email} onChange={(event) => setPayload({ ...payload, email: event.target.value })} />
          </FormControl>
          <FormControl>
            <Input placeholder="password" value={payload?.password} type="password" onChange={(event) => setPayload({ ...payload, password: event.target.value })} />
          </FormControl>
          <FormControl>
            <Button onClick={() => handleSubmit()}>Submit</Button>
          </FormControl>
        </Stack>
      </Flex>
    </div>
  );
}
