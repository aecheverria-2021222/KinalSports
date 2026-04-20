import { useFieldsStore } from "../../users/store/adminStore.js";

export const useSaveField = () => {
    const createField = useFieldsStore((state) => state.createField);

    const saveField = async (data) => {
        const formData = new FormData();

        formData.append("fieldName", data.fieldName);
        formData.append("description", data.description);
        formData.append("fieldType", data.fieldType);
        formData.append("pricePerHour", data.pricePerHour);
        formData.append("capacity", data.capacity);

        if(data.photo?.length > 0) {
            formData.append("image", data.photo[0]);
        }

        await createField(formData);
    }

    return { saveField };
}