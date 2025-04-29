import { useEffect, useState } from 'react';
import classes from './foodsAdminPage.module.css';
import { Link, useParams } from 'react-router-dom'; // Routing utilities
import { deleteById, getAll, search } from '../../services/foodService'; // Food service methods
import NotFound from '../../components/NotFound/NotFound'; // 404 component
import Title from '../../components/Title/Title'; // Title component
import Search from '../../components/Search/Search'; // Search component
import Price from '../../components/Price/Price'; // Price display component
import { toast } from 'react-toastify'; // Notification library

export default function FoodsAdminPage() {
    // State for storing food items
    const [foods, setFoods] = useState();
    // Get search term from URL params
    const { searchTerm } = useParams();

    // Load foods when component mounts or search term changes
    useEffect(() => {
        loadFoods();
    }, [searchTerm]);

    // Function to load foods based on search term
    const loadFoods = async () => {
        const foods = searchTerm ? await search(searchTerm) : await getAll();
        setFoods(foods);
    };

    // Component to show when no foods are found
    const FoodsNotFound = () => {
        if (foods && foods.length > 0) return;

        return searchTerm ? (
            <NotFound linkRoute="/admin/foods" linkText="Show All" />
        ) : (
            <NotFound linkRoute="/dashboard" linkText="Back to dashboard!" />
        );
    };

    // Function to delete a food item
    const deleteFood = async food => {
        const confirmed = window.confirm(`Delete Food ${food.name}?`);
        if (!confirmed) return;

        await deleteById(food.id);
        toast.success(`"${food.name}" Has Been Removed!`);
        // Update state to remove deleted food
        setFoods(foods.filter(f => f.id !== food.id));
    };

    return (
        <div className={classes.container}>
            <div className={classes.list}>
                {/* Page title */}
                <Title title="Manage Foods" margin="1rem auto" />
                
                {/* Search component */}
                <Search
                    searchRoute="/admin/foods/"
                    defaultRoute="/admin/foods"
                    margin="1rem 0"
                    placeholder="Search Foods"
                />
                
                {/* Add new food button */}
                <Link to="/admin/addFood" className={classes.add_food}>
                    Add Food +
                </Link>
                
                {/* Show not found message if no foods */}
                <FoodsNotFound />
                
                {/* List of food items */}
                {foods &&
                    foods.map(food => (
                        <div key={food.id} className={classes.list_item}>
                            {/* Food image */}
                            <img src={food.imageUrl} alt={food.name} />
                            
                            {/* Food name link */}
                            <Link to={'/food/' + food.id}>{food.name}</Link>
                            
                            {/* Food price */}
                            <Price price={food.price} />
                            
                            {/* Action buttons */}
                            <div className={classes.actions}>
                                <Link to={'/admin/editFood/' + food.id}>Edit</Link>
                                <Link onClick={() => deleteFood(food)}>Delete</Link>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}