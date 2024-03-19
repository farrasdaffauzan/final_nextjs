import { Menu, MenuButton, MenuList, MenuItem, Button, Tag, Avatar } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { useMutation } from "@/hooks/useMutation";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const userData = useContext(UserContext);
  const { mutate } = useMutation();

  const handleLogout = async () => {
    const response = await mutate({
      url: "https://paace-f178cafcae7b.nevacloud.io/api/logout",
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });
    if (!response?.success) {
      console.log("Gagal Logout");
    } else {
      Cookies.remove("user_token");
      router.push("/login");
    }
  };

  return (
    <div className="mx-auto text-center max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div className="bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <img className="h-8 w-auto" src="https://tse4.mm.bing.net/th?id=OIP.d-cssZMmcDWJU_yKxt9abQHaFQ&pid=Api&P=0&h=220" alt="" />
            </a>
          </div>

          <div className=" lg:flex lg:gap-x-12">
            <a href="/" className="text-sm font-semibold leading-6 text-gray-900">
              Home
            </a>
            <a href="/profile" className="text-sm font-semibold leading-6 text-gray-900">
              Profile
            </a>
            <a href="/notifications" className="text-sm font-semibold leading-6 text-gray-900">
              Notification
            </a>
          </div>
          <div className=" lg:flex lg:flex-1 lg:justify-end">
            <Menu>
              <MenuButton borderRadius="full" as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
                <Avatar size="xs" ml={-1} mr={2} />
                {userData?.name}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </nav>
      </div>
    </div>
  );
}
