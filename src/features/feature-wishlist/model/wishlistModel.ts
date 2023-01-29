const wishlistModel = {
  uid: null,
  wishlist_id: null,
  voters: [],
  voters_count: 0,
  status: "",
  title: "",
  description: "",
  _timestamps: {
    created_at: Date.now(),
    updated_at: Date.now(),
    created_by: null,
    updated_by: null,
  },
};

export default wishlistModel;
