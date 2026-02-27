import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { useSearchParams, useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import OrderDetailDialog from "./component/OrderDetailDialog";
import OrderTable from "./component/OrderTable";
import SearchBox from "../..//components/common/SearchBox";
import { getOrderList, setSelectedOrder } from "../../features/order/orderSlice";

const AdminOrderPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { orderList, totalPageNum } = useSelector((state) => state.order);

  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    orderNum: query.get("orderNum") || "",
  });

  const [open, setOpen] = useState(false);

  const tableHeader = [
    "#",
    "Order#",
    "Order Date",
    "User",
    "Order Item",
    "Address",
    "Total Price",
    "Status",
  ];

  useEffect(() => {
    dispatch(getOrderList({ ...searchQuery }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    // 원본 로직 유지: orderNum 비면 query에서 제거
    const next = { ...searchQuery };
    if (next.orderNum === "") delete next.orderNum;

    const params = new URLSearchParams(next);
    navigate("?" + params.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const openEditForm = (order) => {
    setOpen(true);
    dispatch(setSelectedOrder(order));
  };

  const handlePageClick = ({ selected }) => {
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <PageWrap>
      <Container maxWidth="lg">
        <ContentWrap>
          <SearchRow>
            <SearchBox
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="오더번호"
              field="orderNum"
            />
          </SearchRow>

          <OrderTable header={tableHeader} data={orderList} openEditForm={openEditForm} />

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

        {open && <OrderDetailDialog open={open} handleClose={handleClose} />}
      </Container>
    </PageWrap>
  );
};

export default AdminOrderPage;

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
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const PaginationWrap = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: theme.spacing(2),

  // react-paginate가 내려주는 부트스트랩 클래스들을 "우리 스타일"로 재정의
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
