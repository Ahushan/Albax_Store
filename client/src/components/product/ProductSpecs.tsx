import { Specifications } from "@/data/types";
import React from "react";

type Props = {
  specifications: Specifications[];
  features: string[];
  warranty?: string;
};

const ProductSpecs: React.FC<Props> = ({ specifications = [], features = [], warranty }) => {
  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold text-lg mb-3">Specifications</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {specifications.map((s, idx) => (
          <div key={idx} className="flex justify-between text-sm bg-white p-2 rounded shadow-sm">
            <div className="text-gray-600">{s.key}</div>
            <div className="font-medium text-gray-800">{s.value}</div>
          </div>
        ))}
      </div>

      {features && features.length > 0 && (
        <>
          <h4 className="font-semibold mt-4 mb-2">Key Features</h4>
          <ul className="list-disc list-inside text-sm">
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </>
      )}

      {warranty && (
        <div className="mt-4 text-sm">
          <strong>Warranty:</strong> {warranty}
        </div>
      )}
    </div>
  );
};

export default ProductSpecs;
