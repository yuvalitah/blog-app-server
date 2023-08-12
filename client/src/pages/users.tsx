import axios from "axios";
import React, { useState, useEffect } from "react";
import { IUser, UsersTable, Pagination } from "../components";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Paper, SelectChangeEvent, styled } from "@mui/material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: theme.palette.mode === "light" ? "#E7EBF0" : "#1A2027",
  flex: 1,
}));

export const UsersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);

  const [users, setUsers] = useState<IUser[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [sortByName, setSortByName] = useState<string>(
    query.get("sortByName") || ""
  );

  useEffect(() => {
    const fetchUsersFromApi = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `http://localhost:3000/users?page=${page}${
            sortByName && `&sortByName=${sortByName}`
          }`
        );
        setUsers(data.users);
        setTotalUsers(data.totalUsers);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    fetchUsersFromApi();
  }, [page, sortByName]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortByName(event.target.value);
    navigate({
      pathname: "/users",
      search: `?page=${page}&sortByName=${event.target.value}`,
    });
  };

  return (
    <StyledPaper>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={5}
      >
        <UsersTable
          users={users}
          sortByName={sortByName}
          handleSortChange={handleSortChange}
          loading={loading}
        />
        <Box mt={5}>
          <Pagination
            page={page}
            perPage={4}
            totalItems={totalUsers}
            linkTo={`/users?sortByName=${sortByName}`}
          />
        </Box>
      </Box>
    </StyledPaper>
  );
};
