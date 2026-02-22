import React, { useEffect, useState } from "react";
import ProductCard from "./component/ProductCard";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";

// pagination
import ReactPaginate from "react-paginate";

// MUI
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { PaginationWrap } from "../AdminProductPage/AdminProductPage";

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const { productList, totalPageNum } = useSelector((state) => state.product);

  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  });

  useEffect(() => {
    const next = {
      page: query.get("page") || 1,
      name: query.get("name") || "",
    };

    setSearchQuery(next);
    dispatch(getProductList({ ...next, pageSize: 8 }));
  }, [query, dispatch]);

  useEffect(() => {
    const nextQuery = { ...searchQuery };

    if (nextQuery.name === "") delete nextQuery.name;

    const nextParams = new URLSearchParams(nextQuery).toString();
    const currentParams = query.toString();

    if (nextParams !== currentParams) {
      navigate("?" + nextParams);
    }
  }, [searchQuery, navigate, query]);

  const handlePageClick = ({ selected }) => {
    setSearchQuery((prev) => ({ ...prev, page: selected + 1 }));
  };

  const name = searchQuery.name;

  return (
    <PageWrap>
      <Container>
        {productList.length > 0 ? (
          <>
            <ProductsFlex>
              {productList.map((item) => (
                <CardItem key={item._id}>
                  <ProductCard item={item} />
                </CardItem>
              ))}
            </ProductsFlex>

            <PaginationWrap>
              <ReactPaginate
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={8}
                pageCount={totalPageNum || 1}
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
          </>
        ) : (
          <EmptyState>
            {name === "" ? (
              <Typography variant="h2">등록된 상품이 없습니다!</Typography>
            ) : (
              <Typography variant="h2">{name}과 일치한 상품이 없습니다!</Typography>
            )}
          </EmptyState>
        )}
      </Container>
    </PageWrap>
  );
};

export default LandingPage;

// 스타일드컴포넌트
const PageWrap = styled(Box)(({ theme }) => ({
  backgroundColor: "#FAF9F8",
  minHeight: "100vh",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
  background: "none",

  "& .MuiContainer-root": {
    maxWidth: "100%",
  },
}));

const ProductsFlex = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: "30px",

  [theme.breakpoints.down("lg")]: {
    gap: "30px",
  },

  [theme.breakpoints.down("md")]: {
    gap: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "20px",
  },
}));

const CardItem = styled("div")(({ theme }) => ({
  width: "calc((100% - 90px) / 4)",

  [theme.breakpoints.down("lg")]: {
    width: "calc((100% - 60px) / 3)",
  },

  [theme.breakpoints.down("md")]: {
    width: "calc((100% - 20px) / 2)",
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: theme.spacing(8, 2),
}));
