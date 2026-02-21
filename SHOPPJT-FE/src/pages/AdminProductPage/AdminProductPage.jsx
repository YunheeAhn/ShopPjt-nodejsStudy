import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import SearchBox from "../../components/common/SearchBox";
import NewItemDialog from "./component/NewItemDialog";
import ProductTable from "./component/ProductTable";
import {
  getProductList,
  deleteProduct,
  setSelectedProduct,
} from "../../features/product/productSlice";

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { productList, totalPageNum } = useSelector((state) => state.product);

  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  }); //검색 조건들을 저장하는 객체

  const [mode, setMode] = useState("new");

  const tableHeader = ["#", "Sku", "Name", "Price", "Stock", "Image", "Status", ""];

  //상품리스트 가져오기 (url쿼리 맞춰서)
  useEffect(() => {
    dispatch(getProductList({ ...searchQuery }));
  }, [query]);

  useEffect(() => {
    //검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
    if (searchQuery.name === "") {
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();
    navigate("?" + query);
  }, [searchQuery]);

  const deleteItem = (id) => {
    //아이템 삭제하가ㅣ
  };

  const openEditForm = (product) => {
    //edit모드로 설정하고
    // 아이템 수정다이얼로그 열어주기
  };

  const handleClickNewItem = () => {
    //new 모드로 설정하고
    setMode("new");
    // 다이얼로그 열어주기
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  return (
    <PageWrap>
      <Container maxWidth="lg">
        <ContentWrap>
          <SearchRow>
            <SearchBox
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="제품 이름으로 검색"
              field="name"
            />
          </SearchRow>

          <ActionRow>
            <AddButton variant="contained" onClick={handleClickNewItem}>
              Add New Item +
            </AddButton>
          </ActionRow>

          <ProductTable
            header={tableHeader}
            data={productList}
            deleteItem={deleteItem}
            openEditForm={openEditForm}
          />

          <PaginationWrap>
            <ReactPaginate
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={totalPageNum}
              forcePage={Number(searchQuery.page) - 1}
              previousLabel="< previous"
              renderOnZeroPageCount={null}
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              className="display-center list-style-none"
            />
          </PaginationWrap>
        </ContentWrap>

        <NewItemDialog mode={mode} showDialog={showDialog} setShowDialog={setShowDialog} />
      </Container>
    </PageWrap>
  );
};

export default AdminProductPage;

// 스타일드 컴포넌트
const PageWrap = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  width: "100%",
}));

const ContentWrap = styled("div")(({ theme }) => ({
  width: "100%",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

const SearchRow = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const ActionRow = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const AddButton = styled(Button)(() => ({
  borderRadius: 12,
  fontWeight: 700,
}));

const PaginationWrap = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: theme.spacing(2),

  "& .pagination": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    padding: 0,
    margin: 0,
  },

  "& .page-item": {
    listStyle: "none",
  },

  "& .page-link": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 36,
    height: 36,
    padding: `0 ${theme.spacing(1)}`,
    borderRadius: 10,
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    background: theme.palette.background.paper,
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.15s ease",
    textDecoration: "none",
  },

  "& .page-link:hover": {
    borderColor: theme.palette.text.secondary,
  },

  "& .active .page-link": {
    borderColor: theme.palette.primary.main,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },

  "& .disabled .page-link": {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  "& .list-style-none": {
    listStyle: "none",
  },

  "& .display-center": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));
