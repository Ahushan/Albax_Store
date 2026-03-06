import { useForm, useFieldArray } from "react-hook-form";
import api from "@/api/API";

export interface ProductFormValues {
  title: string;
  description: string;
  brand: string;
  category: string;
  subCategory: string;
  subCategoryType: string;

  baseImage: string;

  flags: string[];

  generalSpecifications: {
    iconName: string;
    name: string;
    value: string;
  }[];

  variants: {
    price: number;
    stock: number;
    images: string[];
    attributes: Record<string, string>;
    uniqueSpecifications: {
      iconName: string;
      name: string;
      value: string;
    }[];
  }[];
}

export const useProductForm = () => {
  const form = useForm<ProductFormValues>({
    defaultValues: {
      title: "",
      description: "",
      brand: "",
      category: "",
      subCategory: "",
      subCategoryType: "",
      baseImage: "",
      flags: [],

      generalSpecifications: [],

      variants: [
        {
          price: 0,
          stock: 0,
          images: [],
          attributes: {},
          uniqueSpecifications: [],
        },
      ],
    },
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  /* ================================
     FIELD ARRAYS
  ================================= */

  const {
    fields: variants,
    append: addVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const {
    fields: generalSpecifications,
    append: addGeneralSpecification,
    remove: removeGeneralSpecification,
  } = useFieldArray({
    control,
    name: "generalSpecifications",
  });

  /* ================================
     VARIANT HELPERS
  ================================= */

  const addUniqueSpecToVariant = (variantIndex: number) => {
    const current = getValues(`variants.${variantIndex}.uniqueSpecifications`);
    setValue(`variants.${variantIndex}.uniqueSpecifications`, [
      ...current,
      { iconName: "", name: "", value: "" },
    ]);
  };

  const removeUniqueSpecFromVariant = (
    variantIndex: number,
    specIndex: number,
  ) => {
    const current = getValues(`variants.${variantIndex}.uniqueSpecifications`);
    current.splice(specIndex, 1);
    setValue(`variants.${variantIndex}.uniqueSpecifications`, [...current]);
  };

  return {
    form,
    control,
    register,
    handleSubmit,
    watch,
    errors,
    isSubmitting,

    // arrays
    variants,
    addVariant,
    removeVariant,

    generalSpecifications,
    addGeneralSpecification,
    removeGeneralSpecification,

    // variant helpers
    addUniqueSpecToVariant,
    removeUniqueSpecFromVariant,
  };
};
