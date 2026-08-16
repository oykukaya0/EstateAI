from pydantic import BaseModel, Field


class HouseFeatures(BaseModel):

    district: str = Field(min_length=1)
    neighborhood: str = Field(min_length=1)

    rooms: int = Field(ge=0)
    halls: int = Field(ge=0)

    gross_sqm: float = Field(gt=0)
    net_sqm: float = Field(gt=0)

    floor: int
    floor_category: str

    total_floors: int = Field(gt=0)

    building_age: int = Field(ge=0)

    building_type: str
    building_condition: str

    heating_type: str
    fuel_type: str

    bathroom_count: int = Field(ge=0)

    furnished: bool
    usage_status: str

    is_in_complex: bool

    orientation: str

    maintenance_fee: float = Field(ge=0)

    credit_eligible: bool

    deed_status: str

    exchange: bool