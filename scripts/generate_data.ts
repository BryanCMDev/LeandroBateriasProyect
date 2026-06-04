import * as fs from 'fs';
import * as path from 'path';

const rawData = [
  { brand: 'Capsa', model: 'U1R 500', price: 200, url: 'https://bateriascapsa.com/wp-content/uploads/2025/09/U1R-500.png' },
  { brand: 'Capsa', model: 'NS40L 670', price: 280, url: 'https://bateriascapsa.com/wp-content/uploads/2021/04/NS40L550.png' },
  { brand: 'Capsa', model: 'NS60L 700', price: 300, url: 'https://bateriascapsa.com/wp-content/uploads/2021/04/NS60LS700.png' },
  { brand: 'Capsa', model: 'NS60L 770', price: 320, url: 'https://bateriascapsa.com/wp-content/uploads/2025/09/NS60LS-770.png' },
  { brand: 'Capsa', model: '42I 800', price: 315, url: 'https://bateriascapsa.com/wp-content/uploads/2025/09/42I-800.png' },
  { brand: 'Capsa', model: '42I 900', price: 320, url: 'https://bateriascapsa.com/wp-content/uploads/2025/09/42-900.png' },
  { brand: 'Capsa', model: '24R 950', price: 350, url: 'https://bateriascapsa.com/wp-content/uploads/2025/11/24R-1100.png' },
  { brand: 'Capsa', model: '27R 1150', price: 430, url: 'https://bateriascapsa.com/wp-content/uploads/2025/09/27R-1150.png' },
  { brand: 'Capsa', model: '27 1150', price: 430, url: 'https://bateriascapsa.com/wp-content/uploads/2025/09/27-1150.png' },
  { brand: 'Capsa', model: '30H 1600', price: 490, url: 'https://bateriascapsa.com/wp-content/uploads/2025/09/30H-1600.png' },
  { brand: 'Capsa', model: '31T 1600 500', price: 500, url: 'https://bateriascapsa.com/wp-content/uploads/2025/09/31T-1600.png' },
  { brand: 'Capsa', model: '35 1100', price: 370, url: 'https://bateriascapsa.com/wp-content/uploads/2025/09/35-1100.png' },
  { brand: 'Capsa', model: '36IMX 770 (11P)', price: 290, url: 'https://bateriascapsa.com/wp-content/uploads/2025/09/36I-650.png' },
  { brand: 'Capsa', model: '65 1100', price: 520, url: 'https://bateriascapsa.com/wp-content/uploads/2025/09/65-1100.png' },
  { brand: 'Capsa', model: '4D 1800', price: 680, url: 'https://bateriascapsa.com/wp-content/uploads/2025/09/4D1800.png' },
  { brand: 'Capsa', model: '4D 2000', price: 700, url: 'https://bateriascapsa.com/wp-content/uploads/2025/09/4D2000.png' },
  { brand: 'Capsa', model: '8DI 2600', price: 850, url: 'https://bateriascapsa.com/wp-content/uploads/2025/09/8DI-2600.png' },
  { brand: 'Solite', model: '42B19L', price: 280, url: 'https://bateriaskallpa.com/wp-content/uploads/2023/09/solite-42B19L.jpg' },
  { brand: 'Solite', model: '50B19L', price: 300, url: 'https://bateriaskallpa.com/wp-content/uploads/2023/09/solite-65B24L.jpg' },
  { brand: 'Solite', model: '55B24L', price: 320, url: 'https://bateriaskallpa.com/wp-content/uploads/2023/09/solite-55B24LS.jpg' },
  { brand: 'Solite', model: '75D23L', price: 430, url: 'https://ditesac.com/wp-content/uploads/2024/09/BSO0034-768x745.jpg' },
  { brand: 'Solite', model: '105D31L', price: 480, url: 'https://www.daitocar.cl/wp-content/uploads/2025/06/bas206-l.webp' },
  { brand: 'Solite', model: 'CMF55066', price: 380, url: 'https://ditesac.com/wp-content/uploads/2024/09/BSO0047-768x726.jpg' },
  { brand: 'Solite', model: 'CMF56219', price: 400, url: 'https://ditesac.com/wp-content/uploads/2024/09/BSO0052-768x706.jpg' },
  { brand: 'Solite', model: 'CMF57412', price: 480, url: 'https://bateriaskallpa.com/wp-content/uploads/2023/09/Solite-CMF57412-15-PLACAS-600x600.jpg' },
  { brand: 'Varta', model: '27R V5 1300', price: 520, url: 'https://ditesac.com/wp-content/uploads/2024/09/BVA0027.png' },
  { brand: 'Varta', model: '31T V4 1400', price: 550, url: 'https://api.implementos.com.pe/file/sku/1000/CAPBAT0004_1.jpg' },
  { brand: 'Varta', model: '35 V4 850', price: 400, url: 'https://ditesac.com/wp-content/uploads/2024/09/BVA0030-768x768.png' },
  { brand: 'Varta', model: '42IST V4 870', price: 380, url: 'https://ditesac.com/wp-content/uploads/2024/09/BVA0016.jpg' },
  { brand: 'Varta', model: '42IST V5 950', price: 420, url: 'https://ditesac.com/wp-content/uploads/2024/09/BVA0046-768x768.png' },
  { brand: 'Varta', model: '48IST V5 1150', price: 460, url: 'https://ditesac.com/wp-content/uploads/2024/09/BVA0007-768x768.png' },
  { brand: 'Varta', model: '49ST V4 1250', price: 550, url: 'https://ditesac.com/wp-content/uploads/2024/09/BVA0031-49STV41250-3-768x768.jpg' },
  { brand: 'Varta', model: '4DLTI V4 1500', price: 730, url: 'https://api.implementos.com.pe/file/sku/1000/VARBAT3003_1.jpg' },
  { brand: 'Varta', model: '8DI V4 2650', price: 950, url: 'https://api.implementos.com.pe/file/sku/1000/VARBAT3002_1.jpg' },
  { brand: 'Ultrabat', model: 'HL-55', price: 250, url: 'https://elgatobaterias.com/wp-content/uploads/2025/07/HL-55N.jpg' },
  { brand: 'Ultrabat', model: 'FF-66', price: 280, url: 'https://elgatobaterias.com/wp-content/uploads/2025/07/FF66-N.jpg' },
  { brand: 'Ultrabat', model: 'W-70N', price: 290, url: 'https://elgatobaterias.com/wp-content/uploads/2025/07/W-70N-300x300.jpg' },
  { brand: 'Ultrabat', model: 'V-82N', price: 330, url: 'https://elgatobaterias.com/wp-content/uploads/2025/07/V-82I-300x300.jpg' },
  { brand: 'Ultrabat', model: 'S-96I', price: 360, url: 'https://elgatobaterias.com/wp-content/uploads/2025/07/S96-I.jpg' },
  { brand: 'Etna', model: 'HL-11', price: 280, url: 'https://ditesac.com/wp-content/uploads/2024/09/BET0032.png' },
  { brand: 'Etna', model: 'FF-11', price: 300, url: 'https://promart.vteximg.com.br/arquivos/ids/6963206-380-380/150232.jpg?v=638182350717800000' },
  { brand: 'Etna', model: 'FF-13', price: 320, url: 'https://promart.vteximg.com.br/arquivos/ids/6963205-380-380/150233.jpg?v=638182350679130000' },
  { brand: 'Etna', model: 'W-13', price: 330, url: 'https://promart.vteximg.com.br/arquivos/ids/6888016-380-380/149962.jpg?v=638155766389300000' },
  { brand: 'Etna', model: 'V-13NOR', price: 370, url: 'https://promart.vteximg.com.br/arquivos/ids/6888022-380-380/149972.jpg?v=638155766581970000' },
  { brand: 'Etna', model: 'FH-1215NOR', price: 400, url: 'https://promart.vteximg.com.br/arquivos/ids/6888017-380-380/149971.jpg?v=638155766421900000' },
  { brand: 'Etna', model: 'S-1215EM', price: 380, url: 'https://promart.vteximg.com.br/arquivos/ids/6888019-380-380/149970.jpg?v=638155766487900000' },
  { brand: 'Etna', model: 'SU-1217', price: 480, url: 'https://ditesac.com/wp-content/uploads/2024/09/BET0093.png' },
  { brand: 'Etna', model: 'S-1219', price: 580, url: 'https://ditesac.com/wp-content/uploads/2024/09/BET0112.png' },
  { brand: 'Etna', model: 'S-1223 N/I', price: 630, url: 'https://ditesac.com/wp-content/uploads/2024/09/BET0112.png' },
  { brand: 'Enerjet', model: '11D56', price: 290, url: 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2F11d56p.jpg&w=3840&q=75' },
  { brand: 'Enerjet', model: '11T56', price: 320, url: 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2Fffff.png&w=3840&q=75' },
  { brand: 'Enerjet', model: '11W75', price: 320, url: 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2F11w63.jpg&w=3840&q=75' },
  { brand: 'Enerjet', model: '13W75', price: 340, url: 'https://www.enerjet.com.pe/next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2F13w75.png&w=3840&q=75' },
  { brand: 'Enerjet', model: '13S85', price: 380, url: 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2Fbaa0000019.png&w=3840&q=75' },
  { brand: 'Enerjet', model: '15M99', price: 430, url: 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2F15m99.png&w=3840&q=75' },
  { brand: 'Enerjet', model: '15MB90', price: 410, url: 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2Fbaa0000107.png&w=3840&q=75' },
  { brand: 'Enerjet', model: '17T114', price: 510, url: 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2F17t114.jpg&w=3840&q=75' },
  { brand: 'Enerjet', model: '19P130', price: 610, url: 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2F19p130.jpg&w=3840&q=75' },
  { brand: 'Enerjet', model: '23P159', price: 670, url: 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2Fbaa0000011.png&w=3840&q=75' },
  { brand: 'Enerjet', model: '25P170', price: 730, url: 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2Fbaa0000012.png&w=3840&q=75' },
  { brand: 'Enerjet', model: '27P190', price: 770, url: 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2Fbaa0000235.png&w=3840&q=75' },
  { brand: 'Enerjet', model: '33P224', price: 900, url: 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2Fbaa0000106.png&w=3840&q=75' },
];

const processed = rawData.map((d, i) => {
  return {
    id: `prod-${i + 1}`,
    title: `${d.brand} ${d.model}`,
    sku: `${d.brand.toUpperCase()}-${d.model.replace(/ /g, '-').toUpperCase()}-${i + 1}`,
    brand: d.brand,
    model: d.model,
    price: d.price,
    stock: Math.floor(Math.random() * 20) + 5,
    amperage: '50Ah',
    voltage: '12V',
    imageUrl: d.url
  };
});

let orders = [
   {
      id: "ORD-1042",
      date: "2026-05-27",
      customerName: "Juan Pérez",
      documentId: "09812423",
      receiptType: "boleta",
      email: "juan.perez@gmail.com",
      phoneNumber: "987654321",
      items: [
        {
          product: processed[39],
          quantity: 1
        }
      ],
      paymentMethod: "yape",
      total: 325,
      status: "Pendiente"
    }
];

const newOutput = `import { Product, Order } from './types';

export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(processed, null, 2)};

export const INITIAL_ORDERS: Order[] = ${JSON.stringify(orders, null, 2)};

export const BRANDS = ['Capsa', 'Solite', 'Varta', 'Ultrabat', 'Etna', 'Enerjet'];
export const AMPERAGES = ['40Ah', '50Ah', '70Ah'];
export const VOLTAGES = ['12V'];
`;

fs.writeFileSync(path.join(process.cwd(), 'src', 'data.ts'), newOutput);
console.log('Successfully updated src/data.ts');
