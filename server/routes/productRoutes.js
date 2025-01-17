axios.get('http://localhost:5000/products', {
    headers: {
      'Authorization': `Bearer ${AuthService.getToken()}`
    }
  })
  .then(response => {
    console.log('Products:', response.data);
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });
  