import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

// MUI
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const SearchBox = ({ searchQuery, setSearchQuery, placeholder, field }) => {
  const [query] = useSearchParams();
  const [keyword, setKeyword] = useState(query.get(field) || "");

  const onCheckEnter = (event) => {
    if (event.key !== "Enter") return;

    setSearchQuery({
      ...searchQuery,
      page: 1,
      [field]: event.target.value,
    });
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: 2,
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      <IconButton disableRipple>
        <SearchIcon />
      </IconButton>

      <InputBase
        fullWidth
        placeholder={placeholder}
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        onKeyDown={onCheckEnter}
      />
    </Paper>
  );
};

export default SearchBox;
