import Layout from "../components/Layout";
import Card from "../components/Card";
export default function Home() {    
    const sensores = [
        { id: 1, title: "Sensor 1", temperature: 25, humidity: 60, voltage: 3.3 },
        { id: 2, title: "Sensor 2", temperature: 27, humidity: 55, voltage: 3.5 },
        { id: 3, title: "Sensor 3", temperature: 22, humidity: 65, voltage: 3.1 },
      ];
    
      return (
        <Layout>
          <h1 className="text-2xl font-bold mb-4">Dashboard de Sensores</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sensores.map((sensor) => (
              <Card key={sensor.id} {...sensor} />
            ))}
          </div>
        </Layout>
      );
  }
  