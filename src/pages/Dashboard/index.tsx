import { useEffect, useState } from 'react';

import { api } from '../../services/api';
import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface IFoodData {
  id: number,
  image: string,
  name: string,
  description: string,
  price: number,
  available: boolean,
}

export const Dashboard = () => {
  const [foods, setFoods] = useState<IFoodData[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodData>({} as IFoodData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const initDataFood = async () => {
    const responseGetFoods = await api.get('/foods');

    setFoods(responseGetFoods.data);
  }

  useEffect(() => {
    initDataFood();
  },[])

  const handleAddFood = async (food: IFoodData) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([
        ...foods,
        response.data]
      );
    } 
    catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: IFoodData) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } 
    catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: IFoodData) => {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};