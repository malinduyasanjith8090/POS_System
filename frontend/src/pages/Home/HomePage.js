import React, { useEffect, useReducer } from 'react';
import { getAll, getAllByTag, getAllTags, search } from '../../services/foodService'; // Food data services
import Thumbnails from '../../components/Thumbnails/Thumbnails'; // Food thumbnail display component
import { useParams } from 'react-router-dom'; // Routing utilities
import Search from '../../components/Search/Search'; // Search component
import Tags from '../../components/Tags/Tags'; // Food tags component
import NotFound from '../../components/NotFound/NotFound'; // 404 component

// Initial state for reducer
const initialState = { foods: [], tags: [] };

// Reducer function for state management
const reducer = (state, action) => {
  switch (action.type) {
    case 'FOODS_LOADED':
      return { ...state, foods: action.payload }; // Update foods array
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload }; // Update tags array
    default:
      return state;
  }
};

export default function HomePage() {
  // State management with useReducer
  const [state, dispatch] = useReducer(reducer, initialState);
  const { foods, tags } = state;
  
  // Get URL parameters
  const { searchTerm, tag } = useParams();

  // Load data when component mounts or searchTerm/tag changes
  useEffect(() => {
    // Load all tags
    getAllTags().then(tags => dispatch({ type: 'TAGS_LOADED', payload: tags }));

    // Determine which foods to load based on URL params
    const loadFoods = tag
      ? getAllByTag(tag) // Load by tag if specified
      : searchTerm
        ? search(searchTerm) // Search if term specified
        : getAll(); // Otherwise load all foods

    loadFoods.then(foods => dispatch({ type: 'FOODS_LOADED', payload: foods }));
  }, [searchTerm, tag]);

  return (
    <>
      {/* Search bar */}
      <Search />
      
      {/* Food tags filter */}
      <Tags tags={tags} />
      
      {/* Show not found if no foods match */}
      {foods.length === 0 && <NotFound linkText="Search For Foods 😋" />}
      
      {/* Display food thumbnails */}
      <Thumbnails foods={foods} />
    </>
  );
}