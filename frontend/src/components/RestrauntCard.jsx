function RestaurantCard({ restaurant }) {
    return (
        <div>
            <h2>{restaurant.name}</h2>
            <p>{restaurant.description}</p>
        </div>
    );
}

export default RestaurantCard;