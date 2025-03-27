import { Card, CardBody, CardHeader } from "@heroui/card"
import { 
  Sun, 
  Thermometer, 
  CloudRainWind, 
  GlassWater,
  Cloud,
  CloudRain,
  CloudSun,
  CloudFog,
  ThermometerSun,
  ThermometerSnowflake,
  Droplets,
  Droplet
} from "lucide-react"

interface MeasureCardProps {
    className?: string;
    title?: string;
    value?: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    type: 'sun' | 'temperature' | 'rain' | 'humidity';
    numericValue: number;
}

export default function MeasureCard({ className, title, value, type, numericValue }: MeasureCardProps) {
    const getDynamicIcon = () => {
        switch (type) {
            case 'sun':
                if (numericValue >= 80) return <Sun className="h-8 w-8" />;
                if (numericValue >= 60) return <CloudSun className="h-8 w-8" />;
                if (numericValue >= 40) return <Cloud className="h-8 w-8" />;
                return <CloudFog className="h-8 w-8" />;
            
            case 'temperature':
                if (numericValue >= 30) return <ThermometerSun className="h-8 w-8" />;
                if (numericValue >= 20) return <Thermometer className="h-8 w-8" />;
                return <ThermometerSnowflake className="h-8 w-8" />;
            
            case 'rain':
                if (numericValue >= 80) return <CloudRainWind className="h-8 w-8" />;
                if (numericValue >= 40) return <CloudRain className="h-8 w-8" />;
                return <Cloud className="h-8 w-8" />;
            
            case 'humidity':
                if (numericValue >= 80) return <Droplets className="h-8 w-8" />;
                return <Droplet className="h-8 w-8" />;
            
            default:
                return null;
        }
    };

    const getColor = () => {
        switch (type) {
            case 'sun':
                return 'text-yellow-500';
            case 'temperature':
                return numericValue >= 30 ? 'text-red-500' : numericValue >= 20 ? 'text-orange-500' : 'text-blue-500';
            case 'rain':
                return 'text-blue-500';
            case 'humidity':
                return 'text-cyan-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <Card className={`${className} transition-all duration-300 hover:shadow-lg bg-white/50 backdrop-blur-sm`}>
            <CardBody className="flex flex-col items-center justify-center p-6 gap-4">
                <div className={`${getColor()} transition-colors duration-300`}>
                    {getDynamicIcon()}
                </div>
                <div className="text-center">
                    <h2 className="font-semibold text-gray-600 text-sm mb-1">{title}</h2>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
            </CardBody>
        </Card>
    );
}