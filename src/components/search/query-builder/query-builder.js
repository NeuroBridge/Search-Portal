import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  FormControl,
  FormLabel,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  Close as CloseIcon,
  DataObject as RawQueryIcon,
  Send as SearchIcon,
  RestartAlt as ResetIcon,
} from "@mui/icons-material";
import { useSearch } from "../context";
import { SelectionForest } from "./selection-forest";
import { AddTermForm } from "./add-term-form";
import { ConfigMenu } from "./config-menu";
import { Link } from "../../link";
import { useQueryBuilder } from "./context";

export const QueryBuilder = () => {
  const theme = useTheme();
  const [showRawQuery, setShowRawQuery] = useState(false);
  const { fetchResults, loading } = useSearch();
  const {
    query,
    nbQueryObject,
    selectedTerms,
    roots,
    clearQuery,
    handleChangeOperator,
    innerOperator,
    outerOperator,
  } = useQueryBuilder();

  const toggleShowRawQuery = () => {
    setShowRawQuery(!showRawQuery);
  };

  const handleClickStartOver = () => {
    clearQuery();
  };

  return (
    <Card
      sx={{
        position: "relative",
      }}
    >
      <CardHeader
        title="Query Builder"
        subheader={
          <Typography variant="body1">
            Query terms are part of the NeuroBridge ontology, which will be
            available on{" "}
            <Link to="https://bioportal.bioontology.org/">BioPortal</Link> soon.
          </Typography>
        }
      />

      <Divider />

      <SelectionForest query={query} />

      <Divider />

      <CardContent
        sx={{
          padding: "0 !important",
          ".MuiButton-root": {
            p: 4,
            boxShadow: "none",
            "& svg": {
              transform: "translateY(-1px)",
            },
          },
        }}
      >
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="stretch"
          sx={{
            "div.MuiBox-root": { flex: 1 },
            ".MuiButton-root": { borderRadius: 0 },
          }}
        >
          {/* add term button renders here */}
          <AddTermForm />

          {/* raw query button */}
          <Button
            onClick={toggleShowRawQuery}
            startIcon={<RawQueryIcon />}
            disabled={!query}
          >{`${showRawQuery ? "hide" : "view"} query`}</Button>

          {/* options button renders here */}
          <ConfigMenu>
            <Stack
              direction="column"
              gap={2}
              sx={{ minWidth: "300px", p: 2, whiteSpace: "nowrap" }}
            >
              <FormControl>
                <FormLabel>Between concept trees</FormLabel>
                <ToggleButtonGroup
                  aria-label="Operator between concept trees"
                  fullWidth
                  size="small"
                  color="primary"
                  value={outerOperator}
                  exclusive
                  onChange={handleChangeOperator("outer")}
                >
                  <ToggleButton value="AND">AND</ToggleButton>
                  <ToggleButton value="OR">OR</ToggleButton>
                </ToggleButtonGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Within concept trees</FormLabel>
                <ToggleButtonGroup
                  aria-label="Operator within concept trees"
                  fullWidth
                  size="small"
                  color="primary"
                  value={innerOperator}
                  exclusive
                  onChange={handleChangeOperator("inner")}
                >
                  <ToggleButton value="AND">AND</ToggleButton>
                  <ToggleButton value="OR">OR</ToggleButton>
                </ToggleButtonGroup>
              </FormControl>
            </Stack>
          </ConfigMenu>

          {/* reset button */}
          <Button
            disabled={roots.length === 0}
            onClick={handleClickStartOver}
            startIcon={<ResetIcon />}
          >
            Reset
          </Button>

          <Box sx={{ minWidth: "1rem" }} />

          {/* search button */}
          <LoadingButton
            variant={roots.length === 0 ? "text" : "contained"}
            disabled={roots.length === 0}
            onClick={() => fetchResults(nbQueryObject, selectedTerms)}
            endIcon={<SearchIcon />}
            loading={loading}
            loadingIndicator={<CircularProgress color="primary" size={16} />}
          >
            search
          </LoadingButton>
        </Stack>
      </CardContent>

      <Collapse
        in={showRawQuery}
        sx={{
          position: "relative",
          ".query": {
            m: 0,
            p: 1,
            pl: 3,
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[600]
                : theme.palette.grey[900],
            color: "#eef",
            fontSize: "90%",
          },
        }}
      >
        <IconButton
          onClick={() => setShowRawQuery(false)}
          size="small"
          sx={{
            position: "absolute",
            right: 5,
            top: 5,
          }}
        >
          <CloseIcon
            fontSize="small"
            sx={{ color: "#fff", filter: "opacity(0.75)" }}
          />
        </IconButton>
        <pre className="query">{JSON.stringify(nbQueryObject, null, 2)}</pre>
      </Collapse>

      <Divider />

      <Box sx={{ padding: "8px" }} />
    </Card>
  );
};
