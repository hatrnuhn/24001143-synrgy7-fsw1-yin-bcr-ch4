const fs = require('fs/promises');
const dbPath = 'data/cars.json';
const respond = require('../../response.js');
const {
	ReasonPhrases,
	StatusCodes,
} = require('http-status-codes');


const getCars = async () => {
    try {
        await fs.access(dbPath, fs.constants.F_OK);
        return JSON.parse(await fs.readFile(dbPath));    
    } catch (err) {
        throw new Error('could not read database');
    }
}

const updateCars = async (cars) => {
    try {
        await fs.writeFile(dbPath, JSON.stringify(cars, null, '\t'));
    } catch (err) {
        throw new Error('could not write to database');
    }
}

const getCar = async (id) => {
    try {
        const cars = await getCars();
        let car = null;
        cars.forEach(c => {
            if (c.id === id) {
                car = c;
                return;
            }
        });

        return car;
    } catch (err) {
        throw err;
    }
}

const deleteCar = async (id) => {
    try {
        const cars = await getCars();
        let index = null;
        let found = false;
        cars.forEach((car, i) => {
            if (car.id === id) {
                index = i;
                found = true;
                return;
            };
        });
        
        console.log(index);
        if (found) {
            await updateCars(cars.filter(car => car.id !== id));
            return cars[index];
        } else return null;

    } catch (err) {
        throw err;
    }
}

module.exports = {
    getCars,
    updateCars,
    getCar,
    deleteCar,
}