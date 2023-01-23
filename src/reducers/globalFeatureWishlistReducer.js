import REDUCER_ACTIONS from "./reducer.action";

const globalFeatureWishlistReducer = (state, action) => {
  const { reducerUpdatedAt, featureWishlist } = action.payload;
  switch (action.type) {
    case REDUCER_ACTIONS.FEATURE_WISHLIST.INSERT:
      return {
        ...state,
        reducerUpdatedAt,
        featureWishlist: [...state.featureWishlist, featureWishlist],
      };

    case REDUCER_ACTIONS.FEATURE_WISHLIST.DELETE_ONE:
      const removedOneWishlist = state.featureWishlist.filter((wishlist) => {
        return wishlist.wishlist_id !== featureWishlist.wishlist_id;
      });
      return {
        ...state,
        reducerUpdatedAt,
        featureWishlist: removedOneWishlist,
      };

    case REDUCER_ACTIONS.FEATURE_WISHLIST.DELETE_MANY:
      const removeManyWishlist = state.featureWishlist.filter((wishlist) => {
        return !featureWishlist.includes(wishlist.wishlist_id);
      });
      return {
        ...state,
        reducerUpdatedAt,
        featureWishlist: removeManyWishlist,
      };
    default:
      return state;
  }
};

export default globalFeatureWishlistReducer;
