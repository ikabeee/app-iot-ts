import { Card, CardBody, CardHeader } from "@heroui/card"
interface MeasureCardProps{
    className?: string,
    title?: string,
    value?: string,
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>,
}

export default function MeasureCard({className, title, value, icon:Icon}: MeasureCardProps){
    return (
        <Card className={`${className}`}>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h2 className="font-bold text-[18px] self-center">{title}</h2>
            </CardHeader>
            <CardBody className="flex">
            {Icon && <Icon className="h-[100px] self-center" color="#AE7EDE" width={200} height={150}/>}
                <p className="self-center text-[14px]">{value}</p>
            </CardBody>
        </Card>

    )
}