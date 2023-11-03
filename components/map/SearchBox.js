import {
  Paper,
  InputBase,
  IconButton,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";

function Suggestion({
  id,
  name,
  placeFormatted,
  setLng,
  setLat,
  setSuggestions,
  onRetrieve,
}) {
  const retrieveCoordinates = async () => {
    const url = `https://api.mapbox.com/search/searchbox/v1/retrieve/${id}?session_token=[GENERATED-UUID]&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
    const retrieveSuggestion = await fetch(url);
    const retrieveSuggestionData = await retrieveSuggestion.json();

    setSuggestions(null);
    
    onRetrieve(
      retrieveSuggestionData.features[0].geometry.coordinates[0],
      retrieveSuggestionData.features[0].geometry.coordinates[1]
    );
  };

  return (
    <div>
      <ListItem disablePadding>
        <ListItemButton onClick={retrieveCoordinates}>
          <ListItemText primary={name} secondary={placeFormatted} />
        </ListItemButton>
      </ListItem>
    </div>
  );
}

export default function SearchBox({ onRetrieve }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState(null);

  const inputQuery = (event) => {
    setQuery(event.target.value);
  };

  const clearInput = () => {
    setQuery("");
    setSuggestions(null);
  };

  useEffect(() => {
    if (query === "") return;
    const uriEncodedQuery = encodeURIComponent(query);
    const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${uriEncodedQuery}?limit=10&session_token=[GENERATED-UUID]&country=PH&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
    fetch(url).then(async (response) => {
      const data = await response.json();
      setSuggestions(data);
    });
  }, [query]);

  return (
    <div>
      <Paper sx={{ px: 2, py: 1, display: "flex" }} variant="outlined">
        <InputBase
          value={query}
          onChange={inputQuery}
          fullWidth
          placeholder="Search"
        />
        <IconButton onClick={clearInput}>
          <ClearIcon />
        </IconButton>
      </Paper>
      {suggestions && (
        <Paper sx={{ position: "absolute", zIndex: 3, maxWidth: 500 }}>
          <List sx={{ height: 300, overflowY: "scroll" }}>
            {suggestions.suggestions.map((suggestion) => {
              const { mapbox_id, name, place_formatted } = suggestion;
              return (
                <Suggestion
                  key={mapbox_id}
                  id={mapbox_id}
                  name={name}
                  placeFormatted={place_formatted}
                  setSuggestions={setSuggestions}
                  onRetrieve={onRetrieve}
                />
              );
            })}
          </List>
        </Paper>
      )}
    </div>
  );
}
