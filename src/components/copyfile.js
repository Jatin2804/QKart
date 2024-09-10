  {/* main layout  */}
  <Grid container spacing={3}>
  {/* main section 75% */}
  <Grid item md={ isLoggedIn ? 9 : 12}>
    <Grid container spacing={3}>
      {/* hero section */}
      <Grid item className="product-grid" xs={12}>
        <Box className="hero">
          <p className="hero-heading">
            India’s{" "}
            <span className="hero-highlight">FASTEST DELIVERY</span> to
            your door step
          </p>
        </Box>
      </Grid>

      {/* product section  */}
      <Grid item>
        <Box mt={2} mb={2}>
          {loading ? (
            <div className="loadingDiv">
              <CircularProgress></CircularProgress>
              <Typography variant="h6">Loading Products...</Typography>
            </div>
          ) : (
            <Grid container spacing={3}>
              {data?.length ? (
                data.map((elem) => {
                  return (
                    <Grid
                      item
                      key={elem._id}
                      mt={2} xs={12} sm={6} md={4} lg={3}>
                      <ProductCard product={elem} />
                    </Grid>
                  );
                })
              ) : (
                // <div className="loadingDiv">
                //   <span>😐</span>
                //   <Typography variant="h6">No products found</Typography>
                // </div>
                <div className={"loadingDiv"}>
                  <SentimentDissatisfied />
                  <h3>No products found</h3>
                </div>
              )}
            </Grid>
          )}
        </Box>
      </Grid>
    </Grid>
  </Grid>
{/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
  {/* cart area 25 % */}
  { isLoggedIn ?(
    <Grid item md={3} xs={12}>
    <Cart products={data} item={[]} handleQuantity={()=>{ }} />
  </Grid>
  ):null}
 
</Grid>