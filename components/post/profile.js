import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Grid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  GridItem,
  Input,
  Textarea,
  Flex,
  Avatar,
  Heading,
  Text,
  Box,
  Button,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon, ChatIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useMutation } from "@/hooks/useMutation";
import Cookies from "js-cookie";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/router";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

export default function Post() {
  // https://paace-f178cafcae7b.nevacloud.io/api/posts?type=all URL
  const [post, setPost] = useState();
  const { mutate } = useMutation();
  const userData = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    async function fetchingData() {
      const response = await mutate({
        url: "https://paace-f178cafcae7b.nevacloud.io/api/posts?type=me",
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("user_token")}`,
        },
      });
      setPost(response);
      console.log("Data =>", response);
    }
    fetchingData();
  }, []);

  // Start Function delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  const HandleDeleteConfirmation = (id) => {
    HandleDelete(id);
    setIsDeleteModalOpen(false);
  };

  const HandleDelete = async (id) => {
    try {
      const response = await mutate({
        url: `https://paace-f178cafcae7b.nevacloud.io/api/post/delete/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("user_token")}`,
        },
      });

      if (response?.success) {
        router.reload();
      }
    } catch (error) {}
  };
  // End Function delete

  // Start Function Edit
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);

  const [notesEdit, setNotesEdit] = useState();

  const openEditModal = (id) => {
    setIsModalEditOpen(true);
    notesById(id);
    setEditNoteId(id);
  };

  const closeEditModal = () => {
    setIsModalEditOpen(false);
  };

  const notesById = async (id) => {
    try {
      const res = await fetch(`https://paace-f178cafcae7b.nevacloud.io/api/post/${id}`, {
        headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
      });
      const listNotes = await res.json();
      setNotesEdit(listNotes?.data);
    } catch (error) {}
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`https://paace-f178cafcae7b.nevacloud.io/api/post/update/${editNoteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("user_token")}`,
        },
        body: JSON.stringify({
          description: notesEdit?.description,
        }),
      });
      const result = await response.json();
      if (result?.success) {
        closeEditModal();
        router.reload();
      }
    } catch (error) {
      console.error("Error submitting edit:", error);
    }
  };
  //End Function Edit

  // Start Like and Unlike
  const [loading, setLoading] = useState(false);

  const handleLike = async (id) => {
    const response = await mutate({
      url: `https://paace-f178cafcae7b.nevacloud.io/api/likes/post/${id}`,
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });

    setLoading(true);
    router.reload();
  };
  const handleUnLike = async (id) => {
    const response = await mutate({
      url: `https://paace-f178cafcae7b.nevacloud.io/api/unlikes/post/${id}`,
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });
    setLoading(true);
    router.reload();
  };
  // End Like and Unlike

  // Start Function Open Coment
  const [isModalCommentOpen, setIsModalCommentOpen] = useState(false);
  const [CommentNoteId, setCommentNoteId] = useState(null);

  const [notesComment, setNotesComment] = useState({
    description: "",
  });

  const openCommentModal = (id) => {
    setIsModalCommentOpen(true);
    commentById(id);
    setCommentNoteId(id);
  };

  const closeCommentModal = () => {
    setIsModalCommentOpen(false);
  };

  const commentById = async (id) => {
    try {
      const res = await fetch(`https://paace-f178cafcae7b.nevacloud.io/api/replies/post/${id}`, {
        headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
      });
      const listNotes = await res.json();
      setNotesComment(listNotes);
      console.log("Notes Coment =>", notesComment);
    } catch (error) {}
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(`https://paace-f178cafcae7b.nevacloud.io/api/replies/post/${CommentNoteId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("user_token")}`,
        },
        body: JSON.stringify({
          description: notesComment?.description,
        }),
      });
      const result = await response.json();
      if (result?.success) {
        closeCommentModal();
        router.reload();
      }
    } catch (error) {
      console.error("Error submitting edit:", error);
    }
  };
  //End Function Open Coment

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
                        <Flex>
                          <Heading size="sm">{item?.user?.name}</Heading>
                          {item?.user?.name === userData?.name && <Heading size="sm"> (You)</Heading>}
                        </Flex>
                        <Text>{item?.user?.email}</Text>
                      </Box>
                    </Flex>
                    {item?.user?.name === userData?.name && (
                      <Menu>
                        <MenuButton as={Button} rightIcon={<HamburgerIcon />}></MenuButton>
                        <MenuList>
                          <MenuItem onClick={() => openEditModal(item?.id)}>Edit</MenuItem>
                          <MenuItem
                            onClick={() => {
                              setItemToDeleteId(item?.id);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    )}
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Text>{item?.description}</Text>
                </CardBody>

                <CardFooter justify="space-between" flexWrap="wrap">
                  {item.is_like_post === true ? (
                    <Button onClick={() => handleUnLike(item.id)} flex="1" variant="ghost" leftIcon={<FaHeart style={{ color: "#A0153E" }} />}>
                      <p> {item.likes_count} Like</p>
                    </Button>
                  ) : (
                    <Button onClick={() => handleLike(item.id)} flex="1" variant="ghost" leftIcon={<FaRegHeart />}>
                      <p> {item.likes_count} Like</p>
                    </Button>
                  )}

                  <Button flex="1" variant="ghost" leftIcon={<ChatIcon />} onClick={() => openCommentModal(item?.id)}>
                    <p> {item.replies_count} Comment</p>
                  </Button>
                </CardFooter>
              </Card>
            </Box>
          ))}

          {/* Start Modal Delete */}
          <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalCloseButton />
              <ModalBody>Apakah yakin ingin menghapus Coment ini ?</ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={() => HandleDeleteConfirmation(itemToDeleteId)}>
                  Delete
                </Button>
                <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* End Modal Delete */}

          {/* Start Modal Edit */}
          <Modal isOpen={isModalEditOpen} onClose={() => setIsModalEditOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Comment</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Grid gap="5">
                  <GridItem>
                    <Textarea name="description" value={notesEdit?.description || ""} onChange={(event) => setNotesEdit({ ...notesEdit, description: event.target.value })} />
                  </GridItem>
                </Grid>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={() => handleEditSubmit()}>
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => setIsModalEditOpen(false)}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* End Modal Edit */}

          {/* Start Modal Open Coment */}
          <Modal isOpen={isModalCommentOpen} onClose={() => setIsModalCommentOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Comment</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Grid gap="5">
                  <GridItem textAlign={"center"} justifyContent={"center"}>
                    <Textarea name="description" onChange={(event) => setNotesComment({ ...notesComment, description: event.target.value })} />
                    <Button colorScheme="blue" mr={3} onClick={() => handleCommentSubmit()}>
                      Submit
                    </Button>
                  </GridItem>
                </Grid>
              </ModalBody>
              <ModalFooter>
                <Box>
                  {notesComment?.data?.map((item) => (
                    <Box padding={"4"}>
                      <Card maxW="md">
                        <CardHeader>
                          <Flex spacing="4">
                            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                              <Avatar name="" />

                              <Box>
                                <Flex>
                                  <Heading size="sm">{item?.user?.name}</Heading>
                                  {item?.user?.name === userData?.name && <Heading size="sm"> (You)</Heading>}
                                </Flex>
                                <Text>{item?.user?.email}</Text>
                              </Box>
                            </Flex>
                          </Flex>
                        </CardHeader>
                        <CardBody>
                          <Text>{item?.description}</Text>
                        </CardBody>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* End Modal  Open Coment */}
        </Grid>
      </div>
    </>
  );
}
