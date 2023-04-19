// Retrieve data
fetch('https://fakestoreapi.com/users')
  .then(response => response.json())
  .then(users => {

    fetch('https://fakestoreapi.com/carts/?startdate=2000-01-01&enddate=2023-04-07')
        .then(response => response.json())
        .then(carts => {

            fetch('https://fakestoreapi.com/products')
                .then(response => response.json())
                .then(products => {
         

            let categories = {};

            products.forEach(product => {
                if (!categories[product.category]) {
                    categories[product.category] = 0;
                }

                categories[product.category] += product.price;
            });

            //Highest value
            let htValue = 0;
            let hValueCartOwner = '';

            carts.forEach(cart => {
              let cartValue = 0;
              cart.products.forEach(productId => {
                let product = products.find(product => product.id === productId);

                if (product) {
                  cartValue += product.price;
                }
              });

              if (cartValue > highestValue) {
                hValue = cartValue;
                hValueCartOwner = users.find(user => user.id === cart.userId).name;
              }
            });

            //Users living furthest away from each other
            let maxDistance = 0;
            let fUsers = [];

            for (let i = 0; i < users.length - 1; i++) {
              for (let j = i + 1; j < users.length; j++) {
                let distance = distance(users[i].address.geo.lat, users[i].address.geo.lng, users[j].address.geo.lat, users[j].address.geo.lng);

                if (distance > maxDistance) {
                    maxDistance = distance;
                    fUsers = [users[i], users[j]];
                }
              }
            }

            //Results
            console.log('Data structure with product categories and total value:');
            console.log(categories);
            console.log('The highest value:');
            console.log('Value: $' + hValue);
            console.log('Owner: ' + hValueCartOwner);
            console.log('Users living furthest away from each other:');
            console.log('User 1: ' + fUsers[0].name);
            console.log('User 2: ' + ftUsers[1].name);
          })
          .catch(error => console.error('Error retrieving product data:', error));
      })
      .catch(error => console.error('Error retrieving cart data:', error));
  })
  .catch(error => console.error('Error retrieving user data:', error));

// Distance between two points
function distance(lat1, lon1, lat2, lon2) {
	const deg2rad = deg => deg * (Math.PI/180);
    const earthR = 6371; //radius of Earth
    const Lat = deg2rad(lat2 - lat1);
    const Lon = deg2rad(lon2 - lon1);
    const a = Math.sin(Lat/2) * Math.sin(Lat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(Lon/2) * Math.sin(Lon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = earthR * c;
    return dist;
}