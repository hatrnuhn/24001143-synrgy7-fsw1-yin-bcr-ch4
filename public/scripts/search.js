const searchCar = async () => {
    try {
        const driverSelect = document.querySelector('#driver');
        const dateInput = document.querySelector('#date');
        const timeInput = document.querySelector('#time');
        const seatsSelect = document.querySelector('#seats');
        const placeholder = document.querySelector('#placeholder');
    
        const seats = seatsSelect.value;

        const response = await fetch('http://localhost:3000/cars', {
          method: 'GET'
        });
        const data = await response.json(); // Parse JSON response

        let filtered = null;
        
        switch (seats) {
            case 'coupe':
                filtered = data.filter((car) => {
                    return car.capacity > 0 && car.capacity < 3;
                })
                break;
            case 'small':
                filtered = data.filter((car) => {
                    return car.capacity > 2 && car.capacity < 5;
                })
                break;
            case 'medium':
                filtered = data.filter((car) => {
                    return car.capacity > 4 && car.capacity < 7;
                })
                break;
            case 'large':
                filtered = data.filter((car) => {
                    return car.capacity > 6;
                })
                break;
            default:
                filtered = data;
                break;
        }

        placeholder.innerHTML = ""; // Clear the container before adding new content
        for (const car of filtered) {
            placeholder.innerHTML += `
            <div class="flex flex-col justify-between p-6 border-2 gap-4">
                <div class="image flex justify-center">
                    <img src="public${car.image.slice(1)}" alt="" class="object-cover w-44 h-44 sm:w-52 sm:h-52 lg:w-64 lg:h-64">
                </div>
                <p class="type">${car.manufacture} ${car.model}</p>
                <p class="price font-semibold">${car.rentPerDay.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })} / hari</p>
                <p class="descs">${car.description}</p>
                <div class="seats flex gap-4">
                    <div class="icon--20px user-icon svg bg-bcr-dark"></div>
                    <p>${car.capacity} Orang</p>
                </div>
                <div class="trans flex gap-4">
                    <div class="icon--20px gear-icon svg bg-bcr-dark"></div>
                    <p>${car.transmission}</p>
                </div>
                <div class="year flex gap-4">
                    <div class="icon--20px cal-icon svg bg-bcr-dark"></div>
                    <p>Tahun ${car.year}</p>
                </div>
                <button class="button flex justify-center bg-bcr-limegreen">Pilih Mobil</button>
            </div>
          `;
        }
      } catch (err) {
        console.error(err);
        placeholder.innerHTML = '';
        placeholder.innerHTML = 'Error fetching cars';
      }

}
