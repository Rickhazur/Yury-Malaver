
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Plus, Search, AlertTriangle, Package } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, onSnapshot, query } from 'firebase/firestore';

const InventoryView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', stock: 0, price: 0 });

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'inventory'));
    const unsub = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        setProducts(items);
    }, (err) => console.log("Inventory load error (collection likely doesn't exist yet)", err));
    return () => unsub();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    await addDoc(collection(db, 'inventory'), {
        ...newProduct,
        min_stock: 5,
        last_restock: new Date().toISOString()
    });
    setShowModal(false);
    setNewProduct({ name: '', category: '', stock: 0, price: 0 });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-2xl text-rose-950 font-bold">Inventario</h2>
            <button onClick={() => setShowModal(true)} className="bg-rose-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
                <Plus size={18} /> Nuevo Producto
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {products.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-rose-50 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-neutral-800">{p.name}</h4>
                        <p className="text-xs text-neutral-500">{p.category}</p>
                        <div className="text-rose-900 font-bold mt-2">${p.price.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                        <div className={`text-2xl font-bold ${p.stock < p.min_stock ? 'text-red-500' : 'text-green-600'}`}>
                            {p.stock}
                        </div>
                        <div className="text-[10px] text-neutral-400 uppercase">Stock</div>
                    </div>
                </div>
            ))}
            {products.length === 0 && (
                <div className="col-span-3 bg-neutral-50 p-8 rounded-xl text-center text-neutral-400 border border-dashed border-neutral-200">
                    <Package size={40} className="mx-auto mb-2 opacity-50"/>
                    <p>No hay productos en inventario.</p>
                </div>
            )}
        </div>

        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                 <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                    <h3 className="font-serif text-xl text-rose-950 font-bold mb-4">Agregar Producto</h3>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                        <input placeholder="Nombre Producto" className="w-full border border-neutral-200 rounded-xl px-4 py-3" 
                            onChange={e => setNewProduct({...newProduct, name: e.target.value})} required/>
                        <input placeholder="Categoría (Shampoo, Tinte...)" className="w-full border border-neutral-200 rounded-xl px-4 py-3" 
                            onChange={e => setNewProduct({...newProduct, category: e.target.value})} required/>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" placeholder="Stock Inicial" className="w-full border border-neutral-200 rounded-xl px-4 py-3" 
                                onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} required/>
                            <input type="number" placeholder="Precio Unitario" className="w-full border border-neutral-200 rounded-xl px-4 py-3" 
                                onChange={e => setNewProduct({...newProduct, price: parseInt(e.target.value)})} required/>
                        </div>
                        <button className="w-full bg-rose-900 text-white font-bold py-3 rounded-xl">Guardar</button>
                        <button type="button" onClick={() => setShowModal(false)} className="w-full text-neutral-500 py-2">Cancelar</button>
                    </form>
                 </div>
            </div>
        )}
    </div>
  );
};

export default InventoryView;
