<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Dojo>
 */
class DojoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $prefixes = [
            'Ground', 'Iron', 'Shadow', 'Elite', 'Mountain', 'Victory', 'Steel', 'River',
            'Golden', 'Black', 'Crimson', 'Silver', 'Tiger', 'Wolf', 'Eagle', 'Phoenix',
            'Dragon', 'Lone', 'Rising', 'Dynamic', 'True', 'Northern', 'Southern', 'Eastern',
            'Western', 'Prime', 'Warrior', 'Silent', 'Fierce', 'Storm', 'Thunder', 'Blaze',
            'Sky', 'Ocean', 'Fire', 'Rock', 'Glacier', 'Wind', 'Star', 'Sun', 'Moon', 'Nebula'
        ];
        
        $suffixes = [
            'Hammer', 'Fist', 'Warriors', 'Grappling', 'Dojo', 'Academy', 'Martial Arts',
            'Club', 'Tiger', 'Training', 'Claw', 'Strike', 'Legends', 'Path', 'Hall', 'Forge',
            'Guardians', 'Sanctuary', 'Masters', 'Way', 'Den', 'Circle', 'School', 'Focus',
            'Challengers', 'Blaze', 'Clan', 'Alliance', 'Haven', 'Peak', 'Summit', 'Guard',
            'Horizon', 'Quest', 'Trail', 'Order', 'Core', 'Sanctum', 'Domain', 'Division'
        ];
        

        return [
            'name' => $this->faker->unique()->randomElement($prefixes) . ' ' . $this->faker->randomElement($suffixes)
        ];
    }
}