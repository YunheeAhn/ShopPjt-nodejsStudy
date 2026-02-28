import React, { useEffect } from "react";
import ProductCard from "./component/ProductCard";
import { useSearchParams } from "react-router-dom";
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
import { useMemo } from "react";

const LandingPage = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useSearchParams();
  const { productList, totalPageNum } = useSelector((state) => state.product);

  const page = Number(query.get("page") || 1);
  const name = query.get("name") || "";
  const category = query.get("category") || "";

  useEffect(() => {
    dispatch(getProductList({ page, name, category, pageSize: 8 }));
  }, [dispatch, page, name, category]);

  const handlePageClick = ({ selected }) => {
    const next = new URLSearchParams(query);
    next.set("page", String(selected + 1));
    setQuery(next);
  };

  const normalizedCategory = (v) =>
    String(v ?? "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/-/g, "");

  const categoryList = useMemo(() => {
    if (!category) return productList;

    return productList.filter((p) => {
      const cats = Array.isArray(p?.category) ? p.category : [];
      const strCats = cats.filter((x) => typeof x === "string").map(normalizedCategory);
      return strCats.includes(normalizedCategory(category));
    });
  }, [productList, category]);

  const emptyText = useMemo(() => {
    if (name) return `${name}과 일치한 상품이 없습니다!`;
    if (category) return "해당 카테고리에 등록된 제품이 없습니다!";
    return "등록된 상품이 없습니다!";
  }, [name, category]);

  return (
    <PageWrap>
      <Container>
        {categoryList.length > 0 ? (
          <>
            <ProductsFlex>
              {categoryList.map((item) => (
                <CardItem key={item._id}>
                  <ProductCard item={item} />
                </CardItem>
              ))}
            </ProductsFlex>

            <PaginationWrap>
              <ReactPaginate
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={8}
                pageCount={totalPageNum || 1}
                forcePage={page - 1}
                previousLabel="<"
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
            <Typography variant="h2">{emptyText}</Typography>
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
