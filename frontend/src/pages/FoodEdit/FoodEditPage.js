import { useParams } from 'react-router-dom';
import classes from './foodEdit.module.css';
import { useForm } from 'react-hook-form'; // Form handling library
import { useEffect, useState } from 'react'; // React hooks
import { add, getById, update } from '../../services/foodService'; // Food service methods
import Title from '../../components/Title/Title'; // Title component
import InputContainer from '../../components/InputContainer/InputContainer'; // Input container component
import Input from '../../components/Input/Input'; // Input component
import Button from '../../components/Button/Button'; // Button component
import { uploadImage } from '../../services/uploadService'; // Image upload service
import { toast } from 'react-toastify'; // Notification library
import { useNavigate } from 'react-router-dom'; // Navigation hook

export default function FoodEditPage() {
    // Get food ID from URL parameters
    const { foodId } = useParams();
    // State for storing image URL
    const [imageUrl, setImageUrl] = useState();
    // Boolean to check if in edit mode (has foodId)
    const isEditMode = !!foodId;

    const navigate = useNavigate();

    // Form handling with react-hook-form
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm();

    // Fetch food data when in edit mode and foodId changes
    useEffect(() => {
        if (!isEditMode) return;

        getById(foodId).then(food => {
            if (!food) return;
            reset(food); // Reset form with food data
            setImageUrl(food.imageUrl); // Set image URL
        });
    }, [foodId]);

    // Form submission handler
    const submit = async foodData => {
        // Combine form data with image URL
        const food = { ...foodData, imageUrl };

        if (isEditMode) {
            // Update existing food
            await update(food);
            toast.success(`Food "${food.name}" updated successfully!`);
            return;
        }

        // Add new food
        const newFood = await add(food);
        toast.success(`Food "${food.name}" added successfully!`);
        // Navigate to edit page for the new food
        navigate('/admin/editFood/' + newFood.id, { replace: true });
    };

    // Image upload handler
    const upload = async event => {
        setImageUrl(null); // Clear current image
        const imageUrl = await uploadImage(event); // Upload new image
        setImageUrl(imageUrl); // Set new image URL
    };

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                {/* Page title - changes based on mode */}
                <Title title={isEditMode ? 'Edit Food' : 'Add Food'} />
                
                {/* Food form */}
                <form
                    className={classes.form}
                    onSubmit={handleSubmit(submit)}
                    noValidate
                >
                    {/* Image upload input */}
                    <InputContainer label="Select Image">
                        <input type="file" onChange={upload} accept="image/jpeg" />
                    </InputContainer>

                    {/* Display uploaded/preview image */}
                    {imageUrl && (
                        <a href={imageUrl} className={classes.image_link} target="blank">
                            <img src={imageUrl} alt="Uploaded" />
                        </a>
                    )}

                    {/* Food name input */}
                    <Input
                        type="text"
                        label="Name"
                        {...register('name', { required: true, minLength: 5 })}
                        error={errors.name}
                    />

                    {/* Price input */}
                    <Input
                        type="number"
                        label="Price"
                        {...register('price', { required: true })}
                        error={errors.price}
                    />

                    {/* Tags input */}
                    <Input
                        type="text"
                        label="Tags"
                        {...register('tags')}
                        error={errors.tags}
                    />

                    {/* Origins input */}
                    <Input
                        type="text"
                        label="Origins"
                        {...register('origins', { required: true })}
                        error={errors.origins}
                    />

                    {/* Cook time input */}
                    <Input
                        type="text"
                        label="Cook Time"
                        {...register('cookTime', { required: true })}
                        error={errors.cookTime}
                    />

                    {/* Submit button - changes label based on mode */}
                    <Button type="submit" text={isEditMode ? 'Update' : 'Create'} />
                </form>
            </div>
        </div>
    );
}